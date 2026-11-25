/**
 * IvoireMap - Moteur d'itineraires et de recherche de chemins
 * Algorithme multi-criteres : Le plus rapide, Le moins cher, Le plus simple
 * Portage TypeScript fidele de l'ancien js/router.js (classe IvoireRouter)
 */
import type { Place, TransportEdge, TransportModeId, Route, RouteStep } from "./types";

interface GraphEdge {
  edgeId: string;
  to: string;
  mode: TransportModeId;
  duration: number;
  price: number;
  line: string;
  instructions: string;
}

interface PathLeg {
  from: string;
  to: string;
  edge: GraphEdge;
  isTransfer: boolean;
}

type Criterion = "fastest" | "cheapest" | "simplest";

export class IvoireRouter {
  private places: Place[];
  private edges: TransportEdge[];
  private placesMap = new Map<string, Place>();
  private graph = new Map<string, GraphEdge[]>();

  constructor(places: Place[], edges: TransportEdge[]) {
    this.places = places || [];
    this.edges = edges || [];
    this.places.forEach((p) => this.placesMap.set(p.id, p));
    this.initGraph();
  }

  private initGraph() {
    this.places.forEach((p) => this.graph.set(p.id, []));

    this.edges.forEach((edge) => {
      const fromList = this.graph.get(edge.from);
      if (fromList) {
        fromList.push({
          edgeId: edge.id,
          to: edge.to,
          mode: edge.mode,
          duration: edge.duration,
          price: edge.price,
          line: edge.line,
          instructions: edge.instructions,
        });
      }

      if (edge.bidirectional) {
        const toList = this.graph.get(edge.to);
        if (toList) {
          toList.push({
            edgeId: edge.id + "_rev",
            to: edge.from,
            mode: edge.mode,
            duration: edge.duration,
            price: edge.price,
            line: edge.line,
            instructions: edge.instructions,
          });
        }
      }
    });
  }

  getPlace(id: string): Place | undefined {
    return this.placesMap.get(id);
  }

  /** Calcule les variantes d'itineraires (rapide / pas cher / direct) entre deux lieux */
  findRoutes(startId: string, endId: string): Route[] {
    if (!startId || !endId) return [];

    if (startId === endId) {
      const place = this.getPlace(startId);
      if (!place) return [];
      return [
        {
          id: "route_same",
          type: "fastest",
          title: "Depart et arrivee identiques",
          subtitle: "Vous etes deja sur place !",
          totalDuration: 0,
          totalPrice: 0,
          transfersCount: 0,
          summary: "Sur place - 0 min - 0 FCFA",
          steps: [
            {
              stepIndex: 1,
              fromPlace: place,
              toPlace: place,
              mode: "walk",
              duration: 0,
              price: 0,
              line: "Sur place",
              instructions: `Vous vous trouvez deja a ${place.name}.`,
              isTransfer: false,
              coordinates: [
                [place.lat, place.lng],
                [place.lat, place.lng],
              ],
            },
          ],
          coordinates: [
            [place.lat, place.lng],
            [place.lat, place.lng],
          ],
        },
      ];
    }

    const fastest = this.dijkstra(startId, endId, "fastest");
    const cheapest = this.dijkstra(startId, endId, "cheapest");
    const simplest = this.dijkstra(startId, endId, "simplest");

    const routes: Route[] = [];

    if (fastest) {
      routes.push(this.formatRoute(fastest, "fastest", "Le plus rapide", "Moins de temps de trajet"));
    }

    if (cheapest) {
      const isDuplicate = !!fastest && this.areRoutesIdentical(fastest, cheapest);
      if (!isDuplicate) {
        routes.push(this.formatRoute(cheapest, "cheapest", "Le moins cher", "Economique en FCFA"));
      } else {
        const altCheapest = this.findAlternative(startId, endId, fastest, "cheapest");
        routes.push(
          this.formatRoute(
            altCheapest ?? cheapest,
            "cheapest",
            "Le moins cher",
            altCheapest ? "Option economique" : "Meilleur compromis"
          )
        );
      }
    }

    if (simplest) {
      const isDuplicate = routes.some((r) => this.areRoutesIdentical(this.toRawPath(r), simplest));
      if (!isDuplicate) {
        routes.push(this.formatRoute(simplest, "simplest", "Le plus direct", "Moins de correspondances"));
      } else {
        const altSimplest = this.findAlternative(startId, endId, simplest, "simplest");
        if (altSimplest && !routes.some((r) => this.areRoutesIdentical(this.toRawPath(r), altSimplest))) {
          routes.push(this.formatRoute(altSimplest, "simplest", "Le plus direct", "Moins d'arrets"));
        }
      }
    }

    return routes;
  }

  /** Reconstruit un "rawPath" approximatif a partir d'une Route deja formatee (pour deduplication) */
  private toRawPath(route: Route): PathLeg[] {
    return route.steps.map((s) => ({
      from: s.fromPlace.id,
      to: s.toPlace.id,
      edge: { mode: s.mode } as GraphEdge,
      isTransfer: s.isTransfer,
    }));
  }

  private dijkstra(
    startId: string,
    endId: string,
    criterion: Criterion,
    excludedEdges: Set<string> = new Set()
  ): PathLeg[] | null {
    const distances = new Map<string, number>();
    const previous = new Map<string, { from: string; edge: GraphEdge; isTransfer: boolean }>();
    const visited = new Set<string>();
    const pq: { id: string; cost: number; lastMode: TransportModeId | null }[] = [];

    this.places.forEach((p) => distances.set(p.id, Infinity));
    distances.set(startId, 0);
    pq.push({ id: startId, cost: 0, lastMode: null });

    while (pq.length > 0) {
      pq.sort((a, b) => a.cost - b.cost);
      const current = pq.shift()!;

      if (visited.has(current.id)) continue;
      visited.add(current.id);

      if (current.id === endId) {
        return this.reconstructPath(previous, endId, startId);
      }

      const neighbors = this.graph.get(current.id) || [];
      for (const edge of neighbors) {
        if (visited.has(edge.to)) continue;
        if (excludedEdges.has(edge.edgeId)) continue;

        const isTransfer = current.lastMode !== null && current.lastMode !== edge.mode && edge.mode !== "walk";
        const transferWaitMinutes = isTransfer ? 5 : 0;

        let edgeCost = 0;
        if (criterion === "fastest") {
          edgeCost = edge.duration + transferWaitMinutes;
          if (edge.mode === "walk" && edge.duration > 8) edgeCost += 4;
        } else if (criterion === "cheapest") {
          edgeCost = edge.price + edge.duration * 2;
        } else {
          edgeCost = (isTransfer ? 120 : 0) + edge.duration + (edge.mode === "walk" ? 15 : 0);
        }

        const newCost = distances.get(current.id)! + edgeCost;

        if (newCost < distances.get(edge.to)!) {
          distances.set(edge.to, newCost);
          previous.set(edge.to, { from: current.id, edge, isTransfer });
          pq.push({ id: edge.to, cost: newCost, lastMode: edge.mode });
        }
      }
    }

    return null;
  }

  private findAlternative(
    startId: string,
    endId: string,
    existingPath: PathLeg[] | null,
    criterion: Criterion
  ): PathLeg[] | null {
    if (!existingPath || existingPath.length === 0) return null;
    const excluded = new Set<string>();
    const mainEdge = existingPath.find((step) => step.edge.mode !== "walk");
    if (mainEdge) {
      excluded.add(mainEdge.edge.edgeId);
      return this.dijkstra(startId, endId, criterion, excluded);
    }
    return null;
  }

  private areRoutesIdentical(pathA: PathLeg[] | null, pathB: PathLeg[] | null): boolean {
    if (!pathA || !pathB) return false;
    if (pathA.length !== pathB.length) return false;
    for (let i = 0; i < pathA.length; i++) {
      if (pathA[i].from !== pathB[i].from || pathA[i].to !== pathB[i].to || pathA[i].edge.mode !== pathB[i].edge.mode) {
        return false;
      }
    }
    return true;
  }

  private reconstructPath(
    previousMap: Map<string, { from: string; edge: GraphEdge; isTransfer: boolean }>,
    endId: string,
    startId: string
  ): PathLeg[] | null {
    const path: PathLeg[] = [];
    let curr = endId;

    while (curr !== startId) {
      const prevData = previousMap.get(curr);
      if (!prevData) return null;
      path.unshift({ from: prevData.from, to: curr, edge: prevData.edge, isTransfer: prevData.isTransfer });
      curr = prevData.from;
    }

    return path;
  }

  private formatRoute(rawPath: PathLeg[], type: Criterion, title: string, subtitle: string): Route {
    let totalDuration = 0;
    let totalPrice = 0;
    let transfersCount = 0;
    const steps: RouteStep[] = [];
    const fullCoordinates: [number, number][] = [];

    rawPath.forEach((leg, index) => {
      const fromPlace = this.getPlace(leg.from)!;
      const toPlace = this.getPlace(leg.to)!;
      const edge = leg.edge;

      totalDuration += edge.duration;
      totalPrice += edge.price;
      if (leg.isTransfer) {
        transfersCount++;
        totalDuration += 4;
      }

      const legCoords = this.generateLegCoordinates(fromPlace, toPlace, edge.mode);

      legCoords.forEach((pt, ptIdx) => {
        if (fullCoordinates.length === 0 || ptIdx > 0) fullCoordinates.push(pt);
      });

      steps.push({
        stepIndex: index + 1,
        fromPlace,
        toPlace,
        mode: edge.mode,
        duration: edge.duration,
        price: edge.price,
        line: edge.line,
        instructions: edge.instructions,
        isTransfer: leg.isTransfer,
        coordinates: legCoords,
      });
    });

    const modeCounts: Record<string, number> = {};
    steps.forEach((s) => {
      modeCounts[s.mode] = (modeCounts[s.mode] || 0) + 1;
    });

    const summaryParts: string[] = [];
    if (modeCounts["gbaka"]) summaryParts.push("Gbaka");
    if (modeCounts["waren"]) summaryParts.push("Woro-woro");
    if (modeCounts["sotra"]) summaryParts.push("SOTRA");
    if (summaryParts.length === 0 && modeCounts["walk"]) summaryParts.push("Marche");

    const summary = `${summaryParts.join(" + ")} - ${totalDuration} min - ${totalPrice} FCFA`;

    return {
      id: `route_${type}_${Date.now()}_${Math.round(Math.random() * 1000)}`,
      type,
      title,
      subtitle,
      totalDuration,
      totalPrice,
      transfersCount,
      summary,
      steps,
      coordinates: fullCoordinates,
    };
  }

  /** Genere des coordonnees intermediaires realistes (ponts, autoroutes) entre deux lieux */
  private generateLegCoordinates(from: Place, to: Place, mode: TransportModeId): [number, number][] {
    const coords: [number, number][] = [[from.lat, from.lng]];

    const isYopougon = from.commune === "Yopougon" || to.commune === "Yopougon";
    const isAdjame = from.commune === "Adjame" || from.commune === "Adjamé" || to.commune === "Adjame" || to.commune === "Adjamé";
    const isPlateau = from.commune === "Plateau" || to.commune === "Plateau";
    const isCocody = from.commune === "Cocody" || to.commune === "Cocody";
    const isTreichville = from.commune === "Treichville" || to.commune === "Treichville";
    const isMarcory = from.commune === "Marcory" || to.commune === "Marcory";
    const isKoumassi = from.commune === "Koumassi" || to.commune === "Koumassi";
    const isBassam = from.commune === "Grand-Bassam" || to.commune === "Grand-Bassam";

    if (isYopougon && isAdjame) {
      const order = from.lng < to.lng;
      const pts: [number, number][] = [
        [5.343, -4.056],
        [5.352, -4.041],
        [5.359, -4.032],
      ];
      (order ? pts : pts.reverse()).forEach((p) => coords.push(p));
    } else if (isYopougon && isPlateau) {
      const order = from.lng < to.lng;
      const pts: [number, number][] = [
        [5.342, -4.055],
        [5.34, -4.032],
        [5.333, -4.023],
      ];
      (order ? pts : pts.reverse()).forEach((p) => coords.push(p));
    } else if (isAdjame && isPlateau) {
      coords.push([5.344, -4.021]);
    } else if (isPlateau && isTreichville) {
      coords.push([5.316, -4.0145]);
    } else if (isCocody && (isKoumassi || isMarcory) && mode !== "walk") {
      coords.push([5.335, -3.984]);
      coords.push([5.326, -3.983]);
      coords.push([5.312, -3.982]);
    } else if (isBassam) {
      coords.push([5.255, -3.905]);
      coords.push([5.242, -3.852]);
      coords.push([5.215, -3.765]);
    } else {
      coords.push([(from.lat + to.lat) / 2, (from.lng + to.lng) / 2]);
    }

    coords.push([to.lat, to.lng]);
    return coords;
  }
}
