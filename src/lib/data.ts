/**
 * IvoireMap - Dataset des lieux et du reseau de transport d'Abidjan & Cote d'Ivoire
 * Portage TypeScript du data.js original (coordonnees GPS reelles, toponymes officiels et appellations populaires)
 */
import type { TransportMode, Place, TransportEdge, TransportGuide } from "./types";

/**
 * IvoireMap - Dataset des lieux et du réseau de transport d'Abidjan & Côte d'Ivoire
 * Coordonnées GPS réelles, toponymes officiels et appellations populaires (argot / nouchi)
 */

export const TRANSPORT_MODES: Record<string, TransportMode> = {
  gbaka: {
    id: 'gbaka',
    name: 'Gbaka',
    fullName: 'Minibus Gbaka',
    color: '#e8730c',
    icon: 'assets/icons/gbaka.svg',
    badgeClass: 'badge-gbaka',
    tag: 'Rapide & Populaire',
    description: 'Minibus de 18 à 22 places reliant les grandes communes (Yopougon, Adjamé, Abobo, Koumassi, Bassam). L\'apprenti-balanceur crie les destinations.'
  },
  waren: {
    id: 'waren',
    name: 'Wôrô-wôrô',
    fullName: 'Taxi communal (Waren)',
    color: '#138a4a',
    icon: 'assets/icons/waren.svg',
    badgeClass: 'badge-waren',
    tag: 'Communal & Direct',
    description: 'Taxis communaux collectifs à couleur spécifique (jaune à Cocody/Adjamé, bleu à Koumassi, rouge/vert à Yopougon, orange à Marcory/Treichville).'
  },
  sotra: {
    id: 'sotra',
    name: 'Bus SOTRA',
    fullName: 'Société des Transports Abidjanais',
    color: '#2563eb',
    icon: 'assets/icons/sotra.svg',
    badgeClass: 'badge-sotra',
    tag: 'Économique & Spacieux',
    description: 'Réseau de bus urbains officiels Monobloc, Express et Bateau-bus lagunaire. Tarification fixe et arrêts régulés.'
  },
  walk: {
    id: 'walk',
    name: 'Marche',
    fullName: 'Marche à pied',
    color: '#64748b',
    icon: 'assets/icons/walk.svg',
    badgeClass: 'badge-walk',
    tag: 'Gratuit',
    description: 'Déplacement piétonnier pour les correspondances, les traversées de carrefours ou les courtes distances.'
  }
};

/**
 * Lieux référencés d'Abidjan et périphérie
 */
export const PLACES: Place[] = [
  // ==========================================
  // YOPOUGON (Commune la plus peuplée de CI)
  // ==========================================
  {
    id: 'yop_siporex',
    name: 'Carrefour Siporex',
    aliases: ['Siporex', 'Gare Siporex', 'Pont Siporex', 'Carrefour Siporex Yopougon'],
    commune: 'Yopougon',
    category: 'transport_hub',
    categoryName: 'Gare / Carrefour stratégique',
    lat: 5.3375,
    lng: -4.0682,
    popularDescription: 'Le nombril de Yopougon ! Point de départ névralgique de tous les gbakas pour Adjamé, Plateau, Treichville et Koumassi.',
    landmark: 'Station Total Siporex & Passerelle'
  },
  {
    id: 'yop_maroc',
    name: 'Yopougon Maroc',
    aliases: ['Maroc', 'Yop Maroc', 'Carrefour Anador', 'Nouveau Quartier Maroc'],
    commune: 'Yopougon',
    category: 'residential',
    categoryName: 'Quartier résidentiel & commerces',
    lat: 5.3524,
    lng: -4.0751,
    popularDescription: 'Grand quartier commerçant et animé, réputé pour ses maquis, ses supermarchés et ses wôrô-wôrôs pour Siporex.',
    landmark: 'Carrefour Anador / Collège Saint-Louis'
  },
  {
    id: 'yop_selmer',
    name: 'Selmer',
    aliases: ['Yop Selmer', 'Commissariat 16ème', 'Selmer Pharmacie', 'Cité Selmer'],
    commune: 'Yopougon',
    category: 'residential',
    categoryName: 'Quartier historique',
    lat: 5.3418,
    lng: -4.0725,
    popularDescription: 'Cœur historique de Yopougon, bordé de terrasses, de salons de coiffure et du célèbre 16ème arrondissement.',
    landmark: 'Commissariat du 16ème Arrondissement'
  },
  {
    id: 'yop_toits_rouges',
    name: 'Toits Rouges',
    aliases: ['Les Toits', 'Yop Toits Rouges', 'Toit Rouge Terminus', 'Carrefour Toits Rouges'],
    commune: 'Yopougon',
    category: 'residential',
    categoryName: 'Quartier résidentiel',
    lat: 5.3340,
    lng: -4.0835,
    popularDescription: 'Quartier paisible aux toitures en tuiles rouges caractéristiques, desservi par les wôrô-wôrôs et bus SOTRA 27.',
    landmark: 'Terminus Bus 27 Toits Rouges'
  },
  {
    id: 'yop_niangon',
    name: 'Niangon',
    aliases: ['Niangon Sud', 'Niangon Nord', 'Niangon à droite', 'Carrefour Académie', 'Niangon Lokoa'],
    commune: 'Yopougon',
    category: 'residential',
    categoryName: 'Grand ensemble urbain',
    lat: 5.3308,
    lng: -4.1030,
    popularDescription: 'Zone immense divisée en Niangon Sud et Nord, avec ses gares de wôrô-wôrô dédiées reliant Siporex.',
    landmark: 'Carrefour Académie de la Mer'
  },
  {
    id: 'yop_wassakara',
    name: 'Wassakara',
    aliases: ['Wassa', 'Wassakara Marché', 'Carrefour Wassakara', 'Quartier Zouglou'],
    commune: 'Yopougon',
    category: 'culture',
    categoryName: 'Berceau culturel & marché',
    lat: 5.3480,
    lng: -4.0620,
    popularDescription: 'Le berceau légendaire du Zouglou ivoirien ! Quartier populaire très dense avec une ambiance festive permanente.',
    landmark: 'Marché de Wassakara'
  },
  {
    id: 'yop_banco',
    name: 'Banco Quartier',
    aliases: ['Banco 2', 'Yop Banco', 'Quartier Banco', 'Carrefour Banco'],
    commune: 'Yopougon',
    category: 'nature',
    categoryName: 'Zone lisière & quartier',
    lat: 5.3510,
    lng: -4.0530,
    popularDescription: 'Quartier situé en lisière du Parc National du Banco, bordé par l\'Autoroute du Nord.',
    landmark: 'Passerelle piétonne Autoroute du Nord'
  },
  {
    id: 'yop_sideci',
    name: 'Sideci',
    aliases: ['Sideci Lem', 'Carrefour Sideci', 'Sideci Terminus 40', 'Cité Sideci'],
    commune: 'Yopougon',
    category: 'residential',
    categoryName: 'Cité résidentielle',
    lat: 5.3385,
    lng: -4.0780,
    popularDescription: 'Grand quartier résidentiel historique, bien relié au Carrefour Siporex et au Palais de Justice.',
    landmark: 'Palais de Justice de Yopougon'
  },
  {
    id: 'yop_andokoi',
    name: 'Andokoi',
    aliases: ['Andokoi Village', 'Carrefour Andokoi', 'Andokoi Pharmacie'],
    commune: 'Yopougon',
    category: 'residential',
    categoryName: 'Quartier & village intégré',
    lat: 5.3585,
    lng: -4.0580,
    popularDescription: 'Quartier populaire sur les hauteurs de Yopougon, accès direct vers la zone industrielle.',
    landmark: 'Pharmacie d\'Andokoi'
  },
  {
    id: 'yop_lubafrique',
    name: 'Lubafrique',
    aliases: ['Carrefour Lubafrique', 'Station Lubafrique', 'Lubafrique Niangon'],
    commune: 'Yopougon',
    category: 'transport_hub',
    categoryName: 'Carrefour giratoire',
    lat: 5.3285,
    lng: -4.0950,
    popularDescription: 'Carrefour carrefour majeur entre Niangon, Koweït et Toits Rouges.',
    landmark: 'Ancienne usine Lubafrique'
  },
  {
    id: 'yop_figayo',
    name: 'Place Figayo',
    aliases: ['Figayo', 'Place CP1', 'Stade Figayo', 'Espace Figayo'],
    commune: 'Yopougon',
    category: 'landmark',
    categoryName: 'Esplanade & grands événements',
    lat: 5.3435,
    lng: -4.0690,
    popularDescription: 'La grande esplanade de Yopougon accueillant les concerts géants, rassemblements politiques et foires.',
    landmark: 'Mairie centrale de Yopougon'
  },
  {
    id: 'yop_port_bouet_2',
    name: 'Port-Bouët 2',
    aliases: ['PB2', 'Yop PB2', 'Marché Port-Bouët 2', 'Mosquée PB2'],
    commune: 'Yopougon',
    category: 'commercial',
    categoryName: 'Grand marché & carrefour',
    lat: 5.3465,
    lng: -4.0650,
    popularDescription: 'Quartier très vivant avec son marché typique de vivriers et ses ateliers d\'artisans.',
    landmark: 'Grande Mosquée de Port-Bouët 2'
  },
  {
    id: 'yop_koweit',
    name: 'Koweït',
    aliases: ['Yopougon Koweït', 'Quartier Koweït', 'Koweït Terminus'],
    commune: 'Yopougon',
    category: 'residential',
    categoryName: 'Quartier lagunaire',
    lat: 5.3260,
    lng: -4.0760,
    popularDescription: 'Zone résidentielle en pente donnant sur la lagune Ébrié.',
    landmark: 'Bord lagunaire de Koweït'
  },
  {
    id: 'yop_chu',
    name: 'CHU de Yopougon',
    aliases: ['CHU de Yop', 'CHU Yopougon', 'Grand CHU', 'Hôpital CHU'],
    commune: 'Yopougon',
    category: 'health',
    categoryName: 'Centre Hospitalier Universitaire',
    lat: 5.3550,
    lng: -4.0790,
    popularDescription: 'Le grand centre hospitalier universitaire de l\'ouest abidjanais, repère de premier plan.',
    landmark: 'Entrée principale CHU Yopougon'
  },

  // ==========================================
  // ADJAMÉ (Le carrefour et poumon commercial d'Abidjan)
  // ==========================================
  {
    id: 'adj_gare_routiere',
    name: 'Gare Routière d\'Adjamé',
    aliases: ['Gare d\'Adjamé', 'La Gare', 'Gare Ran', 'Gare Nord Adjamé', 'Terminus Adjamé'],
    commune: 'Adjamé',
    category: 'transport_hub',
    categoryName: 'Gare routière internationale & gbaka',
    lat: 5.3620,
    lng: -4.0280,
    popularDescription: 'Le plus grand terminal de gbaka et cars de Côte d\'Ivoire. Des milliers de départs quotidiens pour tout le pays et la sous-région.',
    landmark: 'Gare UTB & Grand quai gbaka'
  },
  {
    id: 'adj_marche_gouro',
    name: 'Marché Gouro',
    aliases: ['Marché Gouro Adjamé', 'Gouro', 'Vivrier Gouro'],
    commune: 'Adjamé',
    category: 'commercial',
    categoryName: 'Marché vivrier emblématique',
    lat: 5.3565,
    lng: -4.0245,
    popularDescription: 'Le marché de gros légendaire où débarquent la banane plantain (foutou), les ignames et les légumes de tout le pays.',
    landmark: 'Hangar central Gouro'
  },
  {
    id: 'adj_roxy',
    name: 'Roxy (Cinéma Roxy)',
    aliases: ['Carrefour Roxy', 'Roxy Adjamé', 'Ancien Roxy', 'Gare Roxy'],
    commune: 'Adjamé',
    category: 'transport_hub',
    categoryName: 'Carrefour gbaka & wôrô-wôrô',
    lat: 5.3530,
    lng: -4.0260,
    popularDescription: 'Carrefour incontournable pour prendre les wôrô-wôrôs en partance vers Cocody, Plateau ou Attécoubé.',
    landmark: 'Bâtiment historique Cinéma Roxy'
  },
  {
    id: 'adj_forum',
    name: 'Forum d\'Adjamé',
    aliases: ['Forum', 'Grand Marché d\'Adjamé', 'Forum des Marchés', 'Nouveau Forum'],
    commune: 'Adjamé',
    category: 'commercial',
    categoryName: 'Mégacentre commercial',
    lat: 5.3570,
    lng: -4.0270,
    popularDescription: 'Gigantesque centre commercial multi-niveaux. On y trouve absolument tout : tissus wax, électronique, chaussures.',
    landmark: 'Dôme du Forum des Marchés'
  },
  {
    id: 'adj_mosquee',
    name: 'Grande Mosquée d\'Adjamé',
    aliases: ['Mosquée d\'Adjamé', 'Grande Mosquée', 'Mosquée Blanche Adjamé'],
    commune: 'Adjamé',
    category: 'landmark',
    categoryName: 'Édifice religieux remarquable',
    lat: 5.3555,
    lng: -4.0225,
    popularDescription: 'Majestueuse mosquée au minaret élancé, point de repère visuel majeur au cœur d\'Adjamé.',
    landmark: 'Minaret de la Grande Mosquée'
  },
  {
    id: 'adj_liberte',
    name: 'Carrefour Liberté',
    aliases: ['Liberté', 'Liberté Adjamé', 'Rond-Point Liberté', 'Station Liberté'],
    commune: 'Adjamé',
    category: 'transport_hub',
    categoryName: 'Carrefour routier stratégique',
    lat: 5.3590,
    lng: -4.0220,
    popularDescription: 'Rond-point névralgique reliant l\'Autoroute du Nord, Abobo, le Zoo et le Boulevard de la Paix.',
    landmark: 'Échangeur Liberté'
  },
  {
    id: 'adj_indenie',
    name: 'Carrefour Indénié',
    aliases: ['Indénié', 'L\'Indénié', 'Échangeur Indénié', 'Carrefour Indénié Nouveau'],
    commune: 'Adjamé',
    category: 'transport_hub',
    categoryName: 'Échangeur clé Plateau - Cocody - Adjamé',
    lat: 5.3440,
    lng: -4.0210,
    popularDescription: 'Porte d\'entrée tri-directionnelle flambant neuve reliant le Plateau d\'affaires, Cocody et Adjamé.',
    landmark: 'Viaduc de l\'Échangeur de l\'Indénié'
  },
  {
    id: 'adj_williamsville',
    name: 'Williamsville',
    aliases: ['Willy', 'Williamsville Maca', 'Carrefour Williamsville', 'Marché Willy'],
    commune: 'Adjamé',
    category: 'residential',
    categoryName: 'Quartier collinaire & historique',
    lat: 5.3670,
    lng: -4.0170,
    popularDescription: 'Quartier populaire et verdoyant sur les collines bordant la forêt du Banco et le Zoo d\'Abidjan.',
    landmark: 'Rond-Point Williamsville'
  },

  // ==========================================
  // LE PLATEAU (Centre des affaires & institutions)
  // ==========================================
  {
    id: 'plt_cathedrale',
    name: 'Cathédrale Saint-Paul',
    aliases: ['Cathédrale', 'Saint-Paul', 'Cathédrale du Plateau', 'Saint Paul Plateau'],
    commune: 'Plateau',
    category: 'landmark',
    categoryName: 'Monument architectural & religieux',
    lat: 5.3315,
    lng: -4.0195,
    popularDescription: 'Spectaculaire chef-d\'œuvre futuriste de Roberto Fabbri avec son Christ géant qui domine la baie de Cocody.',
    landmark: 'Croix géante et parvis Saint-Paul'
  },
  {
    id: 'plt_cite_admin',
    name: 'Cité Administrative',
    aliases: ['Les Tours', 'Tours Administratives', 'Cité Administrative', 'Tour A B C D E', 'Ministères'],
    commune: 'Plateau',
    category: 'administrative',
    categoryName: 'Tours ministérielles de Côte d\'Ivoire',
    lat: 5.3280,
    lng: -4.0175,
    popularDescription: 'Les célèbres gratte-ciel administratifs d\'Abidjan (Tours A, B, C, D, E) où siègent les ministères.',
    landmark: 'Esplanade des 5 Tours'
  },
  {
    id: 'plt_marche',
    name: 'Marché du Plateau',
    aliases: ['Marché Plateau', 'Marché Pyramide', 'Petit Marché Plateau'],
    commune: 'Plateau',
    category: 'commercial',
    categoryName: 'Marché de centre-ville',
    lat: 5.3235,
    lng: -4.0180,
    popularDescription: 'Le marché central du Plateau, parfait pour les fruits frais, fleurs et repas de midi des cadres.',
    landmark: 'Rue du Commerce'
  },
  {
    id: 'plt_gare_sotra',
    name: 'Gare SOTRA Plateau (Gare Sud)',
    aliases: ['Gare SOTRA Plateau', 'Gare Sud', 'Terminus Bus Plateau', 'Gare Sud Plateau'],
    commune: 'Plateau',
    category: 'transport_hub',
    categoryName: 'Grand terminus bus SOTRA Sud',
    lat: 5.3195,
    lng: -4.0185,
    popularDescription: 'Immense terminus central pour tous les bus SOTRA vers Treichville, Marcory, Koumassi, Yopougon et Port-Bouët.',
    landmark: 'Quais SOTRA face à la lagune'
  },
  {
    id: 'plt_pyramide',
    name: 'La Pyramide',
    aliases: ['Pyramide', 'Bâtiment Pyramide', 'La Pyramide du Plateau'],
    commune: 'Plateau',
    category: 'landmark',
    categoryName: 'Joyau moderniste ivoirien',
    lat: 5.3250,
    lng: -4.0170,
    popularDescription: 'Monument mondial de l\'architecture brutaliste par Rinaldo Olivieri, symbole audacieux du miracle ivoirien.',
    landmark: 'Angle Avenue Franchet d\'Esperey'
  },
  {
    id: 'plt_bceao',
    name: 'Siège National BCEAO',
    aliases: ['BCEAO', 'Banque Centrale', 'BCEAO Plateau', 'Tour BCEAO'],
    commune: 'Plateau',
    category: 'financial',
    categoryName: 'Haute finance & repère',
    lat: 5.3240,
    lng: -4.0195,
    popularDescription: 'Imposante tour de la Banque Centrale des États de l\'Afrique de l\'Ouest dominant l\'Avenue Terrasson de Fougères.',
    landmark: 'Grande Tour BCEAO'
  },
  {
    id: 'plt_stade_fhb',
    name: 'Stade Félix Houphouët-Boigny',
    aliases: ['Le Félicia', 'Stade FHB', 'Stade Houphouët-Boigny', 'Félicia Plateau'],
    commune: 'Plateau',
    category: 'sports',
    categoryName: 'Stade national historique',
    lat: 5.3270,
    lng: -4.0140,
    popularDescription: 'Le mythique "Félicia" rénové, théâtre des grands matchs des Éléphants de Côte d\'Ivoire.',
    landmark: 'Entrée Tribune Officielle Félicia'
  },

  // ==========================================
  // COCODY (Commune résidentielle, diplomatique et étudiante)
  // ==========================================
  {
    id: 'coc_riviera2',
    name: 'Riviera 2',
    aliases: ['Riviera 2', 'R2', 'Carrefour R2', 'Alpha Blondy Carrefour', 'Échangeur R2'],
    commune: 'Cocody',
    category: 'transport_hub',
    categoryName: 'Carrefour giratoire & gbaka',
    lat: 5.3465,
    lng: -3.9870,
    popularDescription: 'Carrefour incontournable sur le Boulevard François Mitterrand, connu pour son échangeur et la proximité de la résidence d\'Alpha Blondy.',
    landmark: 'Échangeur Riviera 2'
  },
  {
    id: 'coc_riviera3',
    name: 'Riviera 3 (Bonoumin)',
    aliases: ['Riviera 3', 'Bonoumin', 'R3', 'Carrefour Bonoumin', 'Lycée Français R3'],
    commune: 'Cocody',
    category: 'commercial',
    categoryName: 'Zone commerciale huppée & résidences',
    lat: 5.3580,
    lng: -3.9720,
    popularDescription: 'Quartier branché avec Cap Nord, le Lycée Français Jean Mermoz et de nombreux cafés chics.',
    landmark: 'Centre commercial Cap Nord / Bonoumin'
  },
  {
    id: 'coc_angre',
    name: 'Angré 8ème Tranche',
    aliases: ['Angré', '8ème Tranche', 'Château d\'Angré', 'Pétro Ivoire Angré', 'Angré Terminus 81'],
    commune: 'Cocody',
    category: 'residential',
    categoryName: 'Grand quartier résidentiel moderne',
    lat: 5.3780,
    lng: -3.9860,
    popularDescription: 'Zone en plein essor réputée pour ses restaurants, lounges branchés et ses wôrô-wôrôs jaunes pour Adjamé.',
    landmark: 'Château d\'eau d\'Angré'
  },
  {
    id: 'coc_deux_plateaux',
    name: 'II Plateaux (Les Vallons)',
    aliases: ['Deux Plateaux', 'II Plateaux', 'Les Vallons', 'Rue des Jardins', 'Carrefour Duncan'],
    commune: 'Cocody',
    category: 'commercial',
    categoryName: 'Zone huppée & commerces branchés',
    lat: 5.3570,
    lng: -4.0040,
    popularDescription: 'Quartier chic avec la célèbre Rue des Jardins, ses boutiques de luxe, glaciers et restaurants gastronomiques.',
    landmark: 'Rue des Jardins & Carrefour Duncan'
  },
  {
    id: 'coc_st_jean',
    name: 'Saint-Jean de Cocody',
    aliases: ['St Jean', 'Saint-Jean', 'Marché Saint-Jean', 'Église Saint-Jean Cocody'],
    commune: 'Cocody',
    category: 'transport_hub',
    categoryName: 'Plaque tournante transport & église',
    lat: 5.3415,
    lng: -4.0020,
    popularDescription: 'Point de convergence majeur de Cocody. Les wôrô-wôrôs jaunes et gbakas y marquent un arrêt obligé.',
    landmark: 'Paroisse Saint-Jean de Cocody'
  },
  {
    id: 'coc_danga',
    name: 'Carrefour Danga',
    aliases: ['Danga', 'Carrefour Danga', 'Danga Cocody', 'Hôtel Ivoire Danga'],
    commune: 'Cocody',
    category: 'landmark',
    categoryName: 'Quartier résidentiel calme & prestige',
    lat: 5.3380,
    lng: -4.0065,
    popularDescription: 'À deux pas de l\'Hôtel Ivoire Sofitel et de la corniche lagunaire, carrefour stratégique d\'entrée vers Cocody.',
    landmark: 'Sofitel Abidjan Hôtel Ivoire'
  },
  {
    id: 'coc_cocovico',
    name: 'Marché Cocovico',
    aliases: ['Cocovico', 'Marché Cocovico Angré', 'Cocovico Angré'],
    commune: 'Cocody',
    category: 'commercial',
    categoryName: 'Grand marché coopératif de femmes',
    lat: 5.3620,
    lng: -3.9850,
    popularDescription: 'Fondé par les coopératives de femmes vivrières, un marché modèle exemplaire et toujours très approvisionné.',
    landmark: 'Portail du Marché Cocovico'
  },
  {
    id: 'coc_universite',
    name: 'Université Félix Houphouët-Boigny',
    aliases: ['UFHB', 'Campus de Cocody', 'L\'Université', 'Fac de Cocody', 'Campus 1 UFHB'],
    commune: 'Cocody',
    category: 'education',
    categoryName: 'Premier campus universitaire de CI',
    lat: 5.3440,
    lng: -3.9890,
    popularDescription: 'Le grand campus verdoyant abritant plus de 60 000 étudiants, desservi par de nombreuses lignes SOTRA.',
    landmark: 'Entrée principale Amphithéâtre A'
  },
  {
    id: 'coc_palais_culture',
    name: 'Palais de la Culture Bernard Dadié',
    aliases: ['Palais de la Culture', 'Palais', 'Palais Treichville / Cocody', 'Bord Lagunaire Treichville'],
    commune: 'Treichville',
    category: 'culture',
    categoryName: 'Haut lieu des spectacles et concerts',
    lat: 5.3120,
    lng: -4.0120,
    popularDescription: 'Salle mythique de spectacle au bord de la lagune Ébrié, face au Plateau.',
    landmark: 'Salle Anoumabo du Palais de la Culture'
  },

  // ==========================================
  // TREICHVILLE (Cœur festif, marché & artisans)
  // ==========================================
  {
    id: 'tre_gare',
    name: 'Gare de Treichville (Gare de Bassam)',
    aliases: ['Gare de Treichville', 'Gare de Bassam (Treichville)', 'Belleville Treich', 'Terminus Gbaka Bassam'],
    commune: 'Treichville',
    category: 'transport_hub',
    categoryName: 'Gare routière historique & gbaka',
    lat: 5.3090,
    lng: -4.0080,
    popularDescription: 'Gare routière populaire très célèbre : point de départ direct des gbakas pour Port-Bouët et Grand-Bassam.',
    landmark: 'Ancienne Gare ferroviaire RAN'
  },
  {
    id: 'tre_marche',
    name: 'Grand Marché de Treichville',
    aliases: ['Marché de Treichville', 'Grand Marché Treich', 'Marché Belleville'],
    commune: 'Treichville',
    category: 'commercial',
    categoryName: 'Marché couvert historique',
    lat: 5.3050,
    lng: -4.0070,
    popularDescription: 'Bâtiment à arcades iconique regorgeant de pagnes, épices, poteries artisanales et maquis conviviaux.',
    landmark: 'Arcades du Grand Marché'
  },
  {
    id: 'tre_av12',
    name: 'Avenue 12',
    aliases: ['Avenue 12', 'Av 12', 'Rue 12', 'Avenue 12 Treichville', 'Carrefour Av 12'],
    commune: 'Treichville',
    category: 'commercial',
    categoryName: 'Artère marchande animée',
    lat: 5.3040,
    lng: -4.0100,
    popularDescription: 'L\'artère la plus animée de Treichville, bordée d\'échoppes, de tailleurs et de banques.',
    landmark: 'Avenue 12 / Rue 14'
  },
  {
    id: 'tre_port',
    name: 'Port Autonome d\'Abidjan',
    aliases: ['Port d\'Abidjan', 'PAA', 'Le Port', 'Zone Portuaire', 'Direction PAA'],
    commune: 'Treichville',
    category: 'landmark',
    categoryName: 'Premier port thonier et transit d\'Afrique de l\'Ouest',
    lat: 5.2950,
    lng: -4.0180,
    popularDescription: 'Poumon économique national, immense zone portuaire ouverte sur le canal de Vridi.',
    landmark: 'Direction Générale du Port Autonome'
  },

  // ==========================================
  // MARCORY (Zone 4, Anoumabo, restaurants & convivialité)
  // ==========================================
  {
    id: 'mar_marche',
    name: 'Marché de Marcory',
    aliases: ['Marché de Marcory', 'Grand Marché Marcory', 'Marcory Sainte-Thérèse'],
    commune: 'Marcory',
    category: 'commercial',
    categoryName: 'Marché central communal',
    lat: 5.3010,
    lng: -3.9880,
    popularDescription: 'Marché central très chaleureux avec ses gargotes et poissonneries de lagune.',
    landmark: 'Paroisse Sainte-Thérèse de Marcory'
  },
  {
    id: 'mar_zone4',
    name: 'Zone 4 (Rue du 7 Décembre)',
    aliases: ['Zone 4', 'Zone 4C', 'Rue Mercedes', 'Zone 4 Marcory', 'Rue du 7 Décembre'],
    commune: 'Marcory',
    category: 'nightlife',
    categoryName: 'Quartier gastronomique & vie nocturne',
    lat: 5.2890,
    lng: -3.9860,
    popularDescription: 'Le temple de la gastronomie abidjanaise : restaurants internationaux, terrasses, pâtisseries et pubs.',
    landmark: 'Rue du 7 Décembre / Rue Paul Langevin'
  },
  {
    id: 'mar_sans_fil',
    name: 'Marcory Sans Fil',
    aliases: ['Sans Fil', 'Marcory Sans Fil', 'Carrefour Sans Fil', 'Quartier Sans Fil'],
    commune: 'Marcory',
    category: 'residential',
    categoryName: 'Quartier populaire et commerçant',
    lat: 5.3050,
    lng: -3.9820,
    popularDescription: 'Quartier populaire et chaleureux, célèbre pour ses tailleurs et ses kiosques à café.',
    landmark: 'Terrain Sans Fil'
  },
  {
    id: 'mar_anoumabo',
    name: 'Anoumabo',
    aliases: ['Village Anoumabo', 'Anoumabo', 'FEMUA Anoumabo', 'Fief Magic System'],
    commune: 'Marcory',
    category: 'culture',
    categoryName: 'Village traditionnel & berceau du FEMUA',
    lat: 5.3080,
    lng: -3.9720,
    popularDescription: 'Village ébrié rendu mondialement célèbre par Magic System et le Festival des Musiques Urbaines d\'Anoumabo (FEMUA).',
    landmark: 'Place du FEMUA / Église d\'Anoumabo'
  },

  // ==========================================
  // KOUMASSI (Les Remblais, Grand Marché & artisanat)
  // ==========================================
  {
    id: 'kou_marche',
    name: 'Grand Marché de Koumassi',
    aliases: ['Marché de Koumassi', 'Grand Marché Koumassi', 'Koumassi Terminus 05'],
    commune: 'Koumassi',
    category: 'commercial',
    categoryName: 'Mégamarché rénové',
    lat: 5.2940,
    lng: -3.9580,
    popularDescription: 'L\'un des plus grands et plus modernes marchés d\'Abidjan, entièrement réhabilité.',
    landmark: 'Nouvelle halle centrale de Koumassi'
  },
  {
    id: 'kou_remblais',
    name: 'Les Remblais',
    aliases: ['Remblais', 'Koumassi Remblais', 'Carrefour Remblais', 'Remblais Maquis'],
    commune: 'Koumassi',
    category: 'nightlife',
    categoryName: 'Quartier festif & maquis',
    lat: 5.2860,
    lng: -3.9550,
    popularDescription: 'Célèbre avenue jalonnée de maquis branchés où l\'on déguste le meilleur garba et le poulet braisé ivoirien.',
    landmark: 'Boulevard du Gabon / Rue des maquis'
  },
  {
    id: 'kou_nord',
    name: 'Koumassi Nord (Prodomo)',
    aliases: ['Koumassi Nord', 'Prodomo', 'Koumassi Prodomo', 'Carrefour Église Koumassi'],
    commune: 'Koumassi',
    category: 'residential',
    categoryName: 'Quartier résidentiel & transit',
    lat: 5.3010,
    lng: -3.9520,
    popularDescription: 'Zone de liaison rapide entre Koumassi, Marcory et le Pont Henri Konan Bédié.',
    landmark: 'Rond-point Prodomo'
  },

  // ==========================================
  // ABOBO (La commune géante du nord)
  // ==========================================
  {
    id: 'abo_gare',
    name: 'Gare d\'Abobo',
    aliases: ['Gare d\'Abobo', 'Gare Nord Abobo', 'Gare UTB Abobo', 'Terminus Abobo Gare'],
    commune: 'Abobo',
    category: 'transport_hub',
    categoryName: 'Grand pôle de transit nord',
    lat: 5.4200,
    lng: -4.0180,
    popularDescription: 'Gigantesque carrefour de transport avec départs continus de gbakas pour Adjamé, Yopougon, Cocody et Anyama.',
    landmark: 'Gare routière centrale d\'Abobo'
  },
  {
    id: 'abo_marche',
    name: 'Grand Marché d\'Abobo',
    aliases: ['Marché d\'Abobo', 'Grand Marché Abobo', 'Marché Mairie Abobo'],
    commune: 'Abobo',
    category: 'commercial',
    categoryName: 'Marché immense & effervescent',
    lat: 5.4180,
    lng: -4.0150,
    popularDescription: 'Plein de vitalité et de couleurs, l\'un des marchés les plus denses d\'Abidjan.',
    landmark: 'Face à la Mairie d\'Abobo'
  },
  {
    id: 'abo_pk18',
    name: 'PK 18',
    aliases: ['PK18', 'PK 18', 'Carrefour PK18', 'PK 18 Abobo', 'Route Anyama PK18'],
    commune: 'Abobo',
    category: 'transport_hub',
    categoryName: 'Carrefour de l\'axe nord',
    lat: 5.4410,
    lng: -4.0250,
    popularDescription: 'Borne kilométrique 18 sur l\'ancienne voie vers Anyama, carrefour populaire incontournable.',
    landmark: 'Station Shell PK18'
  },
  {
    id: 'abo_baoule',
    name: 'Abobo Baoulé',
    aliases: ['Abobo Baoulé', 'Village Baoulé', 'Abobo Baoulé Village', 'Rond-point Baoulé'],
    commune: 'Abobo',
    category: 'culture',
    categoryName: 'Village traditionnel & festivités',
    lat: 5.4250,
    lng: -3.9960,
    popularDescription: 'Village traditionnel au cœur de la ville, fier de ses chefferies et de ses fêtes de génération.',
    landmark: 'Place de la Chefferie d\'Abobo Baoulé'
  },
  {
    id: 'abo_samake',
    name: 'Carrefour Samaké',
    aliases: ['Samaké', 'Carrefour Samaké', 'Rond-Point Samaké', 'Samaké Abobo'],
    commune: 'Abobo',
    category: 'transport_hub',
    categoryName: 'Rond-point emblématique',
    lat: 5.4120,
    lng: -4.0210,
    popularDescription: 'Le repère le plus connu d\'Abobo pour donner un rendez-vous ou attraper un gbaka.',
    landmark: 'Carrefour Samaké / Pharmacie Samaké'
  },
  {
    id: 'abo_avocatier',
    name: 'Avocatier',
    aliases: ['Avocatier', 'Abobo Avocatier', 'Carrefour Avocatier', 'Avocatier Terminus'],
    commune: 'Abobo',
    category: 'residential',
    categoryName: 'Grand quartier populaire',
    lat: 5.4330,
    lng: -4.0320,
    popularDescription: 'Quartier animé sur les hauteurs nord-ouest, avec liaison directe vers Sagbé et la Maca.',
    landmark: 'Marché d\'Avocatier'
  },
  {
    id: 'abo_anonkoua',
    name: 'Anonkoua-Kouté',
    aliases: ['Anonkoua-Kouté', 'Anonkoua', 'Village Anonkoua', 'Carrefour Anonkoua'],
    commune: 'Abobo',
    category: 'residential',
    categoryName: 'Village Ebrié intégré',
    lat: 5.4380,
    lng: -4.0120,
    popularDescription: 'Quartier traditionnel paisible avec son dédale de ruelles ombragées et sa chefferie.',
    landmark: 'Cour de la chefferie traditionnelle'
  },

  // ==========================================
  // PORT-BOUËT (Aéroport, mer, littoral & Vridi)
  // ==========================================
  {
    id: 'pb_aeroport',
    name: 'Aéroport International Félix Houphouët-Boigny',
    aliases: ['Aéroport FHB', 'Aéroport Abidjan', 'L\'Aéroport', 'Aérogare Port-Bouët', 'Port-Bouët Aéroport'],
    commune: 'Port-Bouët',
    category: 'transport_hub',
    categoryName: 'Aéroport international',
    lat: 5.2570,
    lng: -3.9310,
    popularDescription: 'La principale porte aérienne de la Côte d\'Ivoire, connectée au centre-ville par le Boulevard VGE.',
    landmark: 'Hall départ Aérogare Internationale'
  },
  {
    id: 'pb_vridi',
    name: 'Vridi',
    aliases: ['Vridi', 'Canal de Vridi', 'Cité SIR', 'Zone Industrielle Vridi', 'Vridi Plage'],
    commune: 'Port-Bouët',
    category: 'industrial',
    categoryName: 'Canal maritime & zone industrielle',
    lat: 5.2670,
    lng: -4.0090,
    popularDescription: 'Bordant le mythique canal percé en 1950 reliant la lagune à l\'océan Atlantique.',
    landmark: 'Entrée du Canal de Vridi'
  },
  {
    id: 'pb_route_bassam',
    name: 'Route de Grand-Bassam (Carrefour Anani)',
    aliases: ['Route de Grand-Bassam', 'Carrefour Anani', 'Sortie Bassam', 'Anani Port-Bouët', 'Autoroute Bassam'],
    commune: 'Port-Bouët',
    category: 'transport_hub',
    categoryName: 'Axe autoroutier sud & péage',
    lat: 5.2550,
    lng: -3.9050,
    popularDescription: 'Point de départ sur la nouvelle autoroute côtière vers la ville balnéaire de Grand-Bassam.',
    landmark: 'Carrefour Anani & Début Autoroute'
  },

  // ==========================================
  // BINGERVILLE (Ancienne capitale & verdure)
  // ==========================================
  {
    id: 'bin_carrefour',
    name: 'Carrefour Bingerville',
    aliases: ['Carrefour Bingerville', 'Carrefour Feh Kessé', 'Entrée Bingerville', 'Nouveau Goudron Bingerville'],
    commune: 'Bingerville',
    category: 'transport_hub',
    categoryName: 'Carrefour d\'entrée de la ville',
    lat: 5.3610,
    lng: -3.9180,
    popularDescription: 'Point de jonction où les gbakas venus de Cocody et Adjamé entrent dans Bingerville.',
    landmark: 'Station Pétro Ivoire Carrefour Feh Kessé'
  },
  {
    id: 'bin_centre',
    name: 'Centre-ville Bingerville',
    aliases: ['Centre-ville Bingerville', 'Bingerville Centre', 'Jardin Botanique Bingerville', 'Marché Bingerville'],
    commune: 'Bingerville',
    category: 'culture',
    categoryName: 'Cœur historique & Jardin Botanique',
    lat: 5.3560,
    lng: -3.8950,
    popularDescription: 'Ancienne capitale coloniale ombragée par des arbres centenaires et son Jardin Botanique mondialement réputé.',
    landmark: 'Portail du Jardin Botanique de Bingerville'
  },

  // ==========================================
  // ANYAMA (La cité de la cola & Grand Stade)
  // ==========================================
  {
    id: 'any_centre',
    name: 'Anyama Centre',
    aliases: ['Anyama', 'Gare Anyama', 'Anyama Centre', 'Marché de la Cola Anyama'],
    commune: 'Anyama',
    category: 'commercial',
    categoryName: 'Capitale marchande de la cola & gare ferroviaire',
    lat: 5.4920,
    lng: -4.0510,
    popularDescription: 'Ville cosmopolite célèbre pour son commerce international de noix de cola et sa gare Sitarail.',
    landmark: 'Gare Sitarail d\'Anyama'
  },

  // ==========================================
  // SONGON (L\'ouest verdoyant)
  // ==========================================
  {
    id: 'son_centre',
    name: 'Songon Agban',
    aliases: ['Songon', 'Songon Agban', 'Carrefour Songon', 'Songon Kassemblé', 'Entrée Songon'],
    commune: 'Songon',
    category: 'nature',
    categoryName: 'Quartier périurbain & agropastoral',
    lat: 5.3210,
    lng: -4.2480,
    popularDescription: 'Localité lagunaire verdoyante bordée de plantations et de résidences neuves à l\'ouest d\'Abidjan.',
    landmark: 'Carrefour Songon Agban'
  },

  // ==========================================
  // GRAND-BASSAM (Patrimoine mondial UNESCO)
  // ==========================================
  {
    id: 'bas_quartier_france',
    name: 'Grand-Bassam (Quartier France)',
    aliases: ['Bassam', 'Grand-Bassam', 'Quartier France', 'Plage de Bassam', 'Musée du Costume Bassam'],
    commune: 'Grand-Bassam',
    category: 'landmark',
    categoryName: 'Patrimoine Mondial UNESCO & plages',
    lat: 5.2010,
    lng: -3.7380,
    popularDescription: 'La cité balnéaire historique, classée à l\'UNESCO. Célèbre pour son pont de la Victoire, ses plages et son Musée des Costumes.',
    landmark: 'Pont de la Victoire & Ancien Palais de Justice'
  }
];

/**
 * Réseau de transport (Arêtes / Tronçons)
 * Connexions directes entre les nœuds avec modes, temps, tarifs et consignes ivoiriennes
 */
export const TRANSPORT_EDGES: TransportEdge[] = [
  // -------------------------------------------------------------
  // YOPOUGON INTERNE (Wôrô-wôrô communal vert/rouge & Marche)
  // -------------------------------------------------------------
  {
    id: 'edge_yop_maroc_siporex',
    from: 'yop_maroc',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 10,
    price: 200,
    line: 'Wôrô-wôrô Yopougon Maroc - Siporex',
    instructions: 'Prends le wôrô-wôrô vert au carrefour Anador en direction de Siporex. Tarif normal : 200 FCFA. Descends directement au pied de la passerelle de Siporex.'
  },
  {
    id: 'edge_yop_selmer_siporex',
    from: 'yop_selmer',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 6,
    price: 200,
    line: 'Wôrô-wôrô Selmer - Siporex',
    instructions: 'Monte dans le wôrô-wôrô devant le commissariat du 16ème. Crie au chauffeur "Siporex passerelle direct !" Prix : 200 FCFA.'
  },
  {
    id: 'edge_yop_selmer_siporex_walk',
    from: 'yop_selmer',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'walk',
    duration: 12,
    price: 0,
    line: 'Marche à pied Selmer ➔ Siporex',
    instructions: 'Descends la voie principale à pied tout droit le long des commerces. Environ 800 mètres de marche agréable.'
  },
  {
    id: 'edge_yop_figayo_siporex',
    from: 'yop_figayo',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'walk',
    duration: 8,
    price: 0,
    line: 'Marche piétonne Figayo ➔ Siporex',
    instructions: 'Marche tout droit depuis l\'esplanade Figayo vers la grande station Total de Siporex. C\'est juste à 500 mètres.'
  },
  {
    id: 'edge_yop_figayo_selmer',
    from: 'yop_figayo',
    to: 'yop_selmer',
    bidirectional: true,
    mode: 'walk',
    duration: 6,
    price: 0,
    line: 'Marche Figayo ➔ Selmer',
    instructions: 'Traverse la place Figayo vers le 16ème arrondissement.'
  },
  {
    id: 'edge_yop_wassakara_siporex',
    from: 'yop_wassakara',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Wassakara - Siporex',
    instructions: 'Prends le wôrô-wôrô au carrefour Wassakara. Le trajet coûte 200 FCFA pour rejoindre le rond-point Siporex.'
  },
  {
    id: 'edge_yop_wassakara_pb2',
    from: 'yop_wassakara',
    to: 'yop_port_bouet_2',
    bidirectional: true,
    mode: 'walk',
    duration: 7,
    price: 0,
    line: 'Marche Wassakara ➔ Port-Bouët 2',
    instructions: 'Traverse la rue marchande en coupant par le marché de quartier pour rejoindre Port-Bouët 2.'
  },
  {
    id: 'edge_yop_pb2_siporex',
    from: 'yop_port_bouet_2',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 7,
    price: 200,
    line: 'Wôrô-wôrô Port-Bouët 2 - Siporex',
    instructions: 'Prends un taxi wôrô-wôrô devant la grande mosquée de PB2 jusqu\'au carrefour Siporex (200 F).'
  },
  {
    id: 'edge_yop_sideci_siporex',
    from: 'yop_sideci',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Sideci - Siporex',
    instructions: 'Embarque au carrefour Sideci Lem dans le wôrô-wôrô vert en direction de Siporex.'
  },
  {
    id: 'edge_yop_sideci_toits_rouges',
    from: 'yop_sideci',
    to: 'yop_toits_rouges',
    bidirectional: true,
    mode: 'waren',
    duration: 6,
    price: 200,
    line: 'Wôrô-wôrô Sideci - Toits Rouges',
    instructions: 'Prends le wôrô-wôrô reliant directement Sideci aux Toits Rouges par l\'avenue du palais.'
  },
  {
    id: 'edge_yop_toits_rouges_siporex',
    from: 'yop_toits_rouges',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 12,
    price: 200,
    line: 'Wôrô-wôrô Toits Rouges - Siporex',
    instructions: 'Prends le wôrô-wôrô au terminus des Toits Rouges en direction de Siporex (200 FCFA).'
  },
  {
    id: 'edge_yop_lubafrique_niangon',
    from: 'yop_lubafrique',
    to: 'yop_niangon',
    bidirectional: true,
    mode: 'walk',
    duration: 10,
    price: 0,
    line: 'Marche Lubafrique ➔ Niangon',
    instructions: 'Marche le long du boulevard vers le carrefour Académie.'
  },
  {
    id: 'edge_yop_niangon_siporex',
    from: 'yop_niangon',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 16,
    price: 250,
    line: 'Wôrô-wôrô Niangon Sud/Nord - Siporex',
    instructions: 'Prends le wôrô-wôrô à la gare de Niangon. Précise au chauffeur : "Siporex direct !" Coût : 250 FCFA.'
  },
  {
    id: 'edge_yop_koweit_siporex',
    from: 'yop_koweit',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 14,
    price: 250,
    line: 'Wôrô-wôrô Koweït - Siporex',
    instructions: 'Prends le wôrô-wôrô au terminus de Koweït en direction de Siporex.'
  },
  {
    id: 'edge_yop_andokoi_banco',
    from: 'yop_andokoi',
    to: 'yop_banco',
    bidirectional: true,
    mode: 'walk',
    duration: 12,
    price: 0,
    line: 'Marche Andokoi ➔ Quartier Banco',
    instructions: 'Marche en descendant la voie goudronnée vers la lisière du Banco.'
  },
  {
    id: 'edge_yop_banco_siporex',
    from: 'yop_banco',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Banco - Siporex',
    instructions: 'Prends le wôrô-wôrô à la passerelle du Banco pour rejoindre le pont de Siporex.'
  },
  {
    id: 'edge_yop_chu_maroc',
    from: 'yop_chu',
    to: 'yop_maroc',
    bidirectional: true,
    mode: 'walk',
    duration: 8,
    price: 0,
    line: 'Marche CHU ➔ Maroc',
    instructions: 'Marche le long de la voie du CHU vers le carrefour Anador du Maroc.'
  },
  {
    id: 'edge_yop_chu_siporex',
    from: 'yop_chu',
    to: 'yop_siporex',
    bidirectional: true,
    mode: 'waren',
    duration: 14,
    price: 250,
    line: 'Wôrô-wôrô CHU Yopougon - Siporex',
    instructions: 'Prends le taxi communal devant la porte du CHU vers Siporex (250 F).'
  },

  // -------------------------------------------------------------
  // LIAISON MAJEURE : YOPOUGON ➔ ADJAMÉ (L'artère reine d'Abidjan)
  // -------------------------------------------------------------
  {
    id: 'edge_yop_adj_gbaka',
    from: 'yop_siporex',
    to: 'adj_gare_routiere',
    bidirectional: true,
    mode: 'gbaka',
    duration: 18,
    price: 300,
    line: 'Gbaka Ligne Yopougon Siporex ➔ Adjamé Gare',
    instructions: 'Place-toi sous la passerelle de Siporex. Le balanceur s\'accroche à la portière et crie : "Adjamé ! Adjamé Liberté ! 300 monnaie propre !". Monte rapidement, prépare ta pièce de 500 F ou l\'appoint. Le gbaka file sur l\'Autoroute du Nord, dépasse le Banco et entre par la Liberté jusqu\'au terminus Adjamé Gare.'
  },
  {
    id: 'edge_yop_adj_sotra_bus',
    from: 'yop_siporex',
    to: 'adj_gare_routiere',
    bidirectional: true,
    mode: 'sotra',
    duration: 28,
    price: 200,
    line: 'Bus SOTRA Ligne 37 (Yopougon - Adjamé)',
    instructions: 'Monte dans le grand bus vert SOTRA à l\'arrêt Siporex. Ticket standard : 200 FCFA auprès du receveur. Trajet régulier et sécurisé via l\'Autoroute du Nord jusqu\'à la Gare Nord d\'Adjamé.'
  },

  // -------------------------------------------------------------
  // LIAISON : YOPOUGON ➔ PLATEAU (Axe d'affaires)
  // -------------------------------------------------------------
  {
    id: 'edge_yop_plt_gbaka',
    from: 'yop_siporex',
    to: 'plt_cite_admin',
    bidirectional: true,
    mode: 'gbaka',
    duration: 22,
    price: 350,
    line: 'Gbaka Yopougon Siporex ➔ Plateau Tours',
    instructions: 'Prends le gbaka direct marqué "Plateau - Les Tours" à Siporex. Le gbaka emprunte l\'Autoroute du Nord puis bifurque sur le Boulevard Lagunaire pour déposer au pied de la Cité Administrative (350 F).'
  },
  {
    id: 'edge_yop_plt_sotra',
    from: 'yop_toits_rouges',
    to: 'plt_gare_sotra',
    bidirectional: true,
    mode: 'sotra',
    duration: 32,
    price: 200,
    line: 'Bus SOTRA Ligne 27 (Toits Rouges - Gare Sud Plateau)',
    instructions: 'Prends le bus SOTRA 27 au terminus des Toits Rouges. Il dessert Sideci, Siporex puis file directement au Plateau Gare Sud au bord de la lagune (200 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : YOPOUGON ➔ TREICHVILLE (Via 4ème pont / Autoroute)
  // -------------------------------------------------------------
  {
    id: 'edge_yop_tre_gbaka',
    from: 'yop_siporex',
    to: 'tre_gare',
    bidirectional: true,
    mode: 'gbaka',
    duration: 24,
    price: 350,
    line: 'Gbaka Yopougon ➔ Treichville Belleville',
    instructions: 'Prends le gbaka direction "Treichville Gare de Bassam" à Siporex. Traversée directe via le Boulevard lagunaire et le Pont Houphouët-Boigny vers Treichville.'
  },

  // -------------------------------------------------------------
  // ADJAMÉ INTERNE (Wôrô-wôrô jaune, Forum, Marché Gouro, Marche)
  // -------------------------------------------------------------
  {
    id: 'edge_adj_gare_forum_walk',
    from: 'adj_gare_routiere',
    to: 'adj_forum',
    bidirectional: true,
    mode: 'walk',
    duration: 5,
    price: 0,
    line: 'Marche Adjamé Gare ➔ Forum',
    instructions: 'Traverse l\'allée marchande piétonne pour entrer dans l\'enceinte du grand Forum des Marchés.'
  },
  {
    id: 'edge_adj_forum_gouro_walk',
    from: 'adj_forum',
    to: 'adj_marche_gouro',
    bidirectional: true,
    mode: 'walk',
    duration: 4,
    price: 0,
    line: 'Marche Forum ➔ Marché Gouro',
    instructions: 'Descends la rampe commerçante vers le marché vivrier Gouro.'
  },
  {
    id: 'edge_adj_gouro_roxy_walk',
    from: 'adj_marche_gouro',
    to: 'adj_roxy',
    bidirectional: true,
    mode: 'walk',
    duration: 5,
    price: 0,
    line: 'Marche Marché Gouro ➔ Roxy',
    instructions: 'Marche vers le sud en direction de l\'ancien cinéma Roxy et de la station de taxis wôrô-wôrô.'
  },
  {
    id: 'edge_adj_gouro_mosquee_walk',
    from: 'adj_marche_gouro',
    to: 'adj_mosquee',
    bidirectional: true,
    mode: 'walk',
    duration: 4,
    price: 0,
    line: 'Marche Marché Gouro ➔ Grande Mosquée',
    instructions: 'Passe devant les marchandes d\'ignames pour rejoindre le parvis de la Grande Mosquée.'
  },
  {
    id: 'edge_adj_gare_liberte',
    from: 'adj_gare_routiere',
    to: 'adj_liberte',
    bidirectional: true,
    mode: 'waren',
    duration: 6,
    price: 200,
    line: 'Wôrô-wôrô Adjamé Gare - Liberté',
    instructions: 'Prends le wôrô-wôrô jaune pour remonter jusqu\'à l\'échangeur Liberté (200 F).'
  },
  {
    id: 'edge_adj_liberte_willy',
    from: 'adj_liberte',
    to: 'adj_williamsville',
    bidirectional: true,
    mode: 'waren',
    duration: 7,
    price: 200,
    line: 'Wôrô-wôrô Liberté - Williamsville',
    instructions: 'Prends le wôrô-wôrô au rond-point Liberté en montée vers Williamsville (200 F).'
  },
  {
    id: 'edge_adj_roxy_indenie',
    from: 'adj_roxy',
    to: 'adj_indenie',
    bidirectional: true,
    mode: 'waren',
    duration: 6,
    price: 200,
    line: 'Wôrô-wôrô Roxy - Indénié',
    instructions: 'Prends le taxi wôrô-wôrô jaune à Roxy pour descendre au grand carrefour de l\'Indénié.'
  },
  {
    id: 'edge_adj_roxy_indenie_walk',
    from: 'adj_roxy',
    to: 'adj_indenie',
    bidirectional: true,
    mode: 'walk',
    duration: 12,
    price: 0,
    line: 'Marche Adjamé Roxy ➔ Indénié',
    instructions: 'Descends la colline d\'Adjamé par les trottoirs rénovés jusqu\'à la lagune de l\'Indénié.'
  },

  // -------------------------------------------------------------
  // LIAISON : ADJAMÉ ➔ PLATEAU (Cœur central)
  // -------------------------------------------------------------
  {
    id: 'edge_adj_plt_indenie_cathedrale',
    from: 'adj_indenie',
    to: 'plt_cathedrale',
    bidirectional: true,
    mode: 'walk',
    duration: 12,
    price: 0,
    line: 'Marche Indénié ➔ Cathédrale Saint-Paul',
    instructions: 'Monte la colline du Plateau en passant devant le Musée des Civilisations jusqu\'au parvis de la Cathédrale Saint-Paul.'
  },
  {
    id: 'edge_adj_plt_waren',
    from: 'adj_roxy',
    to: 'plt_cite_admin',
    bidirectional: true,
    mode: 'waren',
    duration: 10,
    price: 250,
    line: 'Wôrô-wôrô Adjamé Roxy ➔ Plateau Les Tours',
    instructions: 'Monte dans le wôrô-wôrô jaune stationné à Roxy en criant "Plateau Tours !". Descends directement devant les tours ministérielles (250 F).'
  },
  {
    id: 'edge_adj_plt_sotra',
    from: 'adj_gare_routiere',
    to: 'plt_gare_sotra',
    bidirectional: true,
    mode: 'sotra',
    duration: 18,
    price: 200,
    line: 'Bus SOTRA Ligne 82 (Adjamé Gare - Plateau Sud)',
    instructions: 'Prends le bus SOTRA 82 à la Gare Routière. Traversée directe du boulevard jusqu\'au terminus Gare Sud (200 F).'
  },

  // -------------------------------------------------------------
  // PLATEAU INTERNE (Marche au cœur de Manhattan des Tropiques)
  // -------------------------------------------------------------
  {
    id: 'edge_plt_cathedrale_cite',
    from: 'plt_cathedrale',
    to: 'plt_cite_admin',
    bidirectional: true,
    mode: 'walk',
    duration: 4,
    price: 0,
    line: 'Marche Cathédrale ➔ Cité Administrative',
    instructions: 'Traverse l\'avenue Jean-Paul II vers l\'esplanade des 5 Tours.'
  },
  {
    id: 'edge_plt_cite_pyramide',
    from: 'plt_cite_admin',
    to: 'plt_pyramide',
    bidirectional: true,
    mode: 'walk',
    duration: 5,
    price: 0,
    line: 'Marche Cité Administrative ➔ La Pyramide',
    instructions: 'Marche vers le sud sur l\'Avenue Franchet d\'Esperey jusqu\'au pied de l\'édifice La Pyramide.'
  },
  {
    id: 'edge_plt_pyramide_bceao',
    from: 'plt_pyramide',
    to: 'plt_bceao',
    bidirectional: true,
    mode: 'walk',
    duration: 3,
    price: 0,
    line: 'Marche Pyramide ➔ Siège BCEAO',
    instructions: 'Fais 200 mètres vers la haute tour de la Banque Centrale BCEAO.'
  },
  {
    id: 'edge_plt_pyramide_marche',
    from: 'plt_pyramide',
    to: 'plt_marche',
    bidirectional: true,
    mode: 'walk',
    duration: 4,
    price: 0,
    line: 'Marche Pyramide ➔ Marché du Plateau',
    instructions: 'Rejoins la Rue du Commerce pour accéder aux étals du marché.'
  },
  {
    id: 'edge_plt_marche_gare_sotra',
    from: 'plt_marche',
    to: 'plt_gare_sotra',
    bidirectional: true,
    mode: 'walk',
    duration: 5,
    price: 0,
    line: 'Marche Marché ➔ Gare SOTRA Sud',
    instructions: 'Descends l\'avenue vers la lagune pour arriver aux quais de la Gare SOTRA Sud.'
  },
  {
    id: 'edge_plt_cite_stade',
    from: 'plt_cite_admin',
    to: 'plt_stade_fhb',
    bidirectional: true,
    mode: 'walk',
    duration: 6,
    price: 0,
    line: 'Marche Cité Administrative ➔ Stade Félicia',
    instructions: 'Marche vers l\'est le long du boulevard pour arriver devant l\'entrée du stade Houphouët-Boigny.'
  },

  // -------------------------------------------------------------
  // LIAISON : ADJAMÉ ➔ COCODY (Via Indénié ou St Jean)
  // -------------------------------------------------------------
  {
    id: 'edge_adj_coc_st_jean_waren',
    from: 'adj_roxy',
    to: 'coc_st_jean',
    bidirectional: true,
    mode: 'waren',
    duration: 12,
    price: 250,
    line: 'Wôrô-wôrô Adjamé Roxy ➔ Cocody Saint-Jean',
    instructions: 'Prends le wôrô-wôrô jaune stationné à Roxy en direction de "Saint-Jean Cocody". Passe par l\'Indénié et monte la colline de Saint-Jean (250 F).'
  },
  {
    id: 'edge_adj_indenie_coc_danga',
    from: 'adj_indenie',
    to: 'coc_danga',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Indénié ➔ Carrefour Danga',
    instructions: 'Prends le wôrô-wôrô à la sortie de l\'échangeur de l\'Indénié vers l\'entrée de Cocody Danga (200 F).'
  },
  {
    id: 'edge_adj_coc_angre_gbaka',
    from: 'adj_gare_routiere',
    to: 'coc_angre',
    bidirectional: true,
    mode: 'gbaka',
    duration: 20,
    price: 300,
    line: 'Gbaka Adjamé Gare ➔ Angré 8ème Tranche',
    instructions: 'Prends le gbaka au quai d\'Adjamé criant "Angré Château ! 8ème Tranche ! 300 F !". Il passe par Williamsville et rejoint Angré.'
  },

  // -------------------------------------------------------------
  // COCODY INTERNE (Wôrô-wôrô jaune de Cocody, Marche, SOTRA)
  // -------------------------------------------------------------
  {
    id: 'edge_coc_danga_st_jean',
    from: 'coc_danga',
    to: 'coc_st_jean',
    bidirectional: true,
    mode: 'walk',
    duration: 7,
    price: 0,
    line: 'Marche Carrefour Danga ➔ Saint-Jean',
    instructions: 'Marche le long du boulevard ombragé de manguiers pour arriver devant l\'église Saint-Jean.'
  },
  {
    id: 'edge_coc_st_jean_deux_plateaux',
    from: 'coc_st_jean',
    to: 'coc_deux_plateaux',
    bidirectional: true,
    mode: 'waren',
    duration: 9,
    price: 200,
    line: 'Wôrô-wôrô Saint-Jean ➔ II Plateaux Les Vallons',
    instructions: 'Prends le wôrô-wôrô jaune au carrefour Saint-Jean pour monter aux Vallons / Rue des Jardins (200 F).'
  },
  {
    id: 'edge_coc_deux_plateaux_angre',
    from: 'coc_deux_plateaux',
    to: 'coc_angre',
    bidirectional: true,
    mode: 'waren',
    duration: 11,
    price: 200,
    line: 'Wôrô-wôrô II Plateaux ➔ Angré Château',
    instructions: 'Embarque dans le wôrô-wôrô jaune sur le boulevard Latrille vers Angré 8ème Tranche (200 F).'
  },
  {
    id: 'edge_coc_angre_cocovico',
    from: 'coc_angre',
    to: 'coc_cocovico',
    bidirectional: true,
    mode: 'walk',
    duration: 10,
    price: 0,
    line: 'Marche Angré ➔ Marché Cocovico',
    instructions: 'Marche 600m en direction du marché couvert de femmes Cocovico.'
  },
  {
    id: 'edge_coc_cocovico_riviera3',
    from: 'coc_cocovico',
    to: 'coc_riviera3',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Cocovico ➔ Riviera 3 Bonoumin',
    instructions: 'Prends le wôrô-wôrô jaune pour rejoindre Cap Nord et le carrefour Bonoumin (200 F).'
  },
  {
    id: 'edge_coc_st_jean_universite',
    from: 'coc_st_jean',
    to: 'coc_universite',
    bidirectional: true,
    mode: 'waren',
    duration: 7,
    price: 200,
    line: 'Wôrô-wôrô Saint-Jean ➔ Campus UFHB',
    instructions: 'Prends le wôrô-wôrô étudiant devant Saint-Jean jusqu\'au portail principal du campus (200 F).'
  },
  {
    id: 'edge_coc_st_jean_universite_walk',
    from: 'coc_st_jean',
    to: 'coc_universite',
    bidirectional: true,
    mode: 'walk',
    duration: 14,
    price: 0,
    line: 'Marche Saint-Jean ➔ Campus UFHB',
    instructions: 'Marche à pied le long du Boulevard de l\'Université.'
  },
  {
    id: 'edge_coc_universite_riviera2',
    from: 'coc_universite',
    to: 'coc_riviera2',
    bidirectional: true,
    mode: 'walk',
    duration: 6,
    price: 0,
    line: 'Marche Campus ➔ Riviera 2',
    instructions: 'Passe devant la cité universitaire Mermoz pour rejoindre l\'échangeur Riviera 2.'
  },
  {
    id: 'edge_coc_riviera2_riviera3',
    from: 'coc_riviera2',
    to: 'coc_riviera3',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Riviera 2 ➔ Riviera 3 Bonoumin',
    instructions: 'Prends le wôrô-wôrô au carrefour R2 tout droit sur le boulevard Mitterrand jusqu\'à Bonoumin (200 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : PLATEAU ➔ TREICHVILLE (Pont FHB & De Gaulle)
  // -------------------------------------------------------------
  {
    id: 'edge_plt_tre_gare_sotra',
    from: 'plt_gare_sotra',
    to: 'tre_gare',
    bidirectional: true,
    mode: 'sotra',
    duration: 10,
    price: 200,
    line: 'Bus SOTRA Ligne 11 (Plateau Sud - Treichville)',
    instructions: 'Prends le bus SOTRA 11 à la Gare Sud du Plateau. Traversée magnifique du Pont Houphouët-Boigny avec vue sur le port jusqu\'à la gare de Treichville (200 F).'
  },
  {
    id: 'edge_plt_tre_waren',
    from: 'plt_marche',
    to: 'tre_marche',
    bidirectional: true,
    mode: 'waren',
    duration: 12,
    price: 250,
    line: 'Wôrô-wôrô Plateau Marché ➔ Grand Marché Treichville',
    instructions: 'Prends le taxi collectif qui franchit le Pont Charles de Gaulle pour te déposer devant le marché couvert de Treichville (250 F).'
  },
  {
    id: 'edge_plt_palais_culture_walk',
    from: 'plt_gare_sotra',
    to: 'coc_palais_culture',
    bidirectional: true,
    mode: 'walk',
    duration: 16,
    price: 0,
    line: 'Traversée à pied du Pont Houphouët-Boigny vers le Palais de la Culture',
    instructions: 'Traverse à pied la passerelle piétonne du Pont Houphouët-Boigny au-dessus de la lagune Ébrié. Superbe panorama sur les tours du Plateau !'
  },

  // -------------------------------------------------------------
  // TREICHVILLE INTERNE & LIAISON MARCORY
  // -------------------------------------------------------------
  {
    id: 'edge_tre_gare_marche',
    from: 'tre_gare',
    to: 'tre_marche',
    bidirectional: true,
    mode: 'walk',
    duration: 6,
    price: 0,
    line: 'Marche Gare Treichville ➔ Grand Marché',
    instructions: 'Marche 400m dans l\'avenue ombragée vers le marché central de Treichville.'
  },
  {
    id: 'edge_tre_marche_av12',
    from: 'tre_marche',
    to: 'tre_av12',
    bidirectional: true,
    mode: 'walk',
    duration: 4,
    price: 0,
    line: 'Marche Grand Marché ➔ Avenue 12',
    instructions: 'Rejoins directement l\'Avenue 12 à pied à travers les boutiques.'
  },
  {
    id: 'edge_tre_av12_port',
    from: 'tre_av12',
    to: 'tre_port',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Avenue 12 ➔ Port Autonome',
    instructions: 'Prends le wôrô-wôrô orangé au carrefour de l\'Avenue 12 vers la Direction du Port Autonome (200 F).'
  },
  {
    id: 'edge_tre_palais_gare',
    from: 'coc_palais_culture',
    to: 'tre_gare',
    bidirectional: true,
    mode: 'walk',
    duration: 7,
    price: 0,
    line: 'Marche Palais de la Culture ➔ Gare de Treichville',
    instructions: 'Longe la lagune vers l\'ancienne gare ferroviaire de Bassam.'
  },
  {
    id: 'edge_tre_mar_marche',
    from: 'tre_marche',
    to: 'mar_marche',
    bidirectional: true,
    mode: 'waren',
    duration: 10,
    price: 200,
    line: 'Wôrô-wôrô Treichville ➔ Marché de Marcory',
    instructions: 'Prends le wôrô-wôrô orange au rond-point Treichville direction Marcory Marché (200 F).'
  },

  // -------------------------------------------------------------
  // MARCORY & ZONE 4 (Wôrô-wôrô orange, Marche)
  // -------------------------------------------------------------
  {
    id: 'edge_mar_marche_sans_fil',
    from: 'mar_marche',
    to: 'mar_sans_fil',
    bidirectional: true,
    mode: 'walk',
    duration: 8,
    price: 0,
    line: 'Marche Marché de Marcory ➔ Sans Fil',
    instructions: 'Marche à pied à travers le quartier chaleureux de Marcory vers Sans Fil.'
  },
  {
    id: 'edge_mar_sans_fil_anoumabo',
    from: 'mar_sans_fil',
    to: 'mar_anoumabo',
    bidirectional: true,
    mode: 'walk',
    duration: 10,
    price: 0,
    line: 'Marche Sans Fil ➔ Village Anoumabo',
    instructions: 'Traverse la rue pavée pour arriver au célèbre village d\'Anoumabo, fief de Magic System.'
  },
  {
    id: 'edge_mar_marche_zone4',
    from: 'mar_marche',
    to: 'mar_zone4',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Marché de Marcory ➔ Zone 4',
    instructions: 'Prends le wôrô-wôrô au marché de Marcory vers la Rue du 7 Décembre en Zone 4 (200 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : MARCORY ➔ KOUMASSI (Wôrô-wôrô bleu, Gbaka)
  // -------------------------------------------------------------
  {
    id: 'edge_mar_kou_nord',
    from: 'mar_sans_fil',
    to: 'kou_nord',
    bidirectional: true,
    mode: 'waren',
    duration: 7,
    price: 200,
    line: 'Wôrô-wôrô Marcory ➔ Koumassi Nord Prodomo',
    instructions: 'Prends le taxi wôrô-wôrô franchissant la limite communale vers Koumassi Nord (200 F).'
  },
  {
    id: 'edge_kou_nord_marche',
    from: 'kou_nord',
    to: 'kou_marche',
    bidirectional: true,
    mode: 'waren',
    duration: 7,
    price: 200,
    line: 'Wôrô-wôrô Koumassi Prodomo ➔ Grand Marché',
    instructions: 'Prends le wôrô-wôrô bleu de Koumassi jusqu\'au nouveau grand marché couvert (200 F).'
  },
  {
    id: 'edge_kou_marche_remblais',
    from: 'kou_marche',
    to: 'kou_remblais',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Koumassi Marché ➔ Les Remblais',
    instructions: 'Prends le wôrô-wôrô bleu au marché pour aller te poser aux célèbres maquis des Remblais (200 F).'
  },
  {
    id: 'edge_kou_marche_remblais_walk',
    from: 'kou_marche',
    to: 'kou_remblais',
    bidirectional: true,
    mode: 'walk',
    duration: 12,
    price: 0,
    line: 'Marche Koumassi Marché ➔ Les Remblais',
    instructions: 'Descends la grande voie goudronnée animée de Koumassi jusqu\'aux Remblais.'
  },

  // -------------------------------------------------------------
  // LIAISON MAJEURE : COCODY ➔ KOUMASSI / MARCORY (Pont HKB)
  // -------------------------------------------------------------
  {
    id: 'edge_coc_kou_sotra_express',
    from: 'coc_riviera2',
    to: 'mar_marche',
    bidirectional: true,
    mode: 'sotra',
    duration: 15,
    price: 500,
    line: 'Bus SOTRA Express Ligne 201 (Via Pont HKB)',
    instructions: 'Prends le Bus Express SOTRA à l\'échangeur Riviera 2. Il franchit à toute allure le grand Pont à péage Henri Konan Bédié (HKB) au-dessus de la lagune et te dépose à Marcory (500 F).'
  },
  {
    id: 'edge_coc_kou_gbaka',
    from: 'coc_riviera2',
    to: 'kou_nord',
    bidirectional: true,
    mode: 'gbaka',
    duration: 16,
    price: 350,
    line: 'Gbaka Riviera 2 ➔ Koumassi',
    instructions: 'Monte dans le gbaka à la station R2 : "Koumassi direct par le pont ! 350 F !". Traversée rapide du pont HKB.'
  },

  // -------------------------------------------------------------
  // LIAISON : KOUMASSI / TREICHVILLE ➔ PORT-BOUËT (Aéroport, Vridi)
  // -------------------------------------------------------------
  {
    id: 'edge_tre_vridi_waren',
    from: 'tre_port',
    to: 'pb_vridi',
    bidirectional: true,
    mode: 'waren',
    duration: 14,
    price: 250,
    line: 'Wôrô-wôrô Port de Treichville ➔ Vridi Canal',
    instructions: 'Prends le taxi collectif longeant le port jusqu\'au canal de Vridi et la cité SIR (250 F).'
  },
  {
    id: 'edge_kou_pb_aeroport_gbaka',
    from: 'kou_remblais',
    to: 'pb_aeroport',
    bidirectional: true,
    mode: 'gbaka',
    duration: 15,
    price: 300,
    line: 'Gbaka Koumassi ➔ Port-Bouët Aéroport FHB',
    instructions: 'Prends le gbaka direction "Port-Bouët Phare / Aéroport" aux Remblais. Il débouche sur le boulevard de l\'Aéroport (300 F).'
  },
  {
    id: 'edge_pb_aeroport_anani',
    from: 'pb_aeroport',
    to: 'pb_route_bassam',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Aéroport ➔ Carrefour Anani (Route Bassam)',
    instructions: 'Prends le wôrô-wôrô devant l\'entrée de l\'aéroport jusqu\'au carrefour Anani au départ de l\'autoroute de Bassam (200 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : ABOBO (Gare, Samaké, PK18, Baoulé, Avocatier)
  // -------------------------------------------------------------
  {
    id: 'edge_abo_samake_gare',
    from: 'abo_samake',
    to: 'abo_gare',
    bidirectional: true,
    mode: 'walk',
    duration: 9,
    price: 0,
    line: 'Marche Samaké ➔ Gare d\'Abobo',
    instructions: 'Remonte l\'avenue commerçante à pied depuis le rond-point Samaké jusqu\'à la grande gare routière.'
  },
  {
    id: 'edge_abo_samake_gare_waren',
    from: 'abo_samake',
    to: 'abo_gare',
    bidirectional: true,
    mode: 'waren',
    duration: 5,
    price: 150,
    line: 'Wôrô-wôrô Samaké - Gare d\'Abobo',
    instructions: 'Prends le wôrô-wôrô jaune au carrefour Samaké pour rejoindre la gare en un clin d\'œil (150 F).'
  },
  {
    id: 'edge_abo_gare_marche',
    from: 'abo_gare',
    to: 'abo_marche',
    bidirectional: true,
    mode: 'walk',
    duration: 5,
    price: 0,
    line: 'Marche Gare d\'Abobo ➔ Grand Marché',
    instructions: 'Traverse la place de la gare pour arriver directement dans le dédale du grand marché.'
  },
  {
    id: 'edge_abo_gare_pk18',
    from: 'abo_gare',
    to: 'abo_pk18',
    bidirectional: true,
    mode: 'waren',
    duration: 10,
    price: 200,
    line: 'Wôrô-wôrô Gare d\'Abobo ➔ PK 18',
    instructions: 'Prends le wôrô-wôrô en direction du PK18 sur la route d\'Anyama (200 F).'
  },
  {
    id: 'edge_abo_gare_baoule',
    from: 'abo_gare',
    to: 'abo_baoule',
    bidirectional: true,
    mode: 'waren',
    duration: 10,
    price: 200,
    line: 'Wôrô-wôrô Gare d\'Abobo ➔ Abobo Baoulé',
    instructions: 'Prends le taxi collectif vers le village traditionnel d\'Abobo Baoulé (200 F).'
  },
  {
    id: 'edge_abo_gare_avocatier',
    from: 'abo_gare',
    to: 'abo_avocatier',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Gare d\'Abobo ➔ Avocatier',
    instructions: 'Prends le wôrô-wôrô vers le quartier Avocatier (200 F).'
  },
  {
    id: 'edge_abo_pk18_anonkoua',
    from: 'abo_pk18',
    to: 'abo_anonkoua',
    bidirectional: true,
    mode: 'walk',
    duration: 12,
    price: 0,
    line: 'Marche PK 18 ➔ Anonkoua-Kouté',
    instructions: 'Marche vers le village d\'Anonkoua-Kouté par la voie latérale.'
  },

  // -------------------------------------------------------------
  // LIAISON : ADJAMÉ ➔ ABOBO (L'axe populaire du nord)
  // -------------------------------------------------------------
  {
    id: 'edge_adj_abo_gbaka',
    from: 'adj_gare_routiere',
    to: 'abo_gare',
    bidirectional: true,
    mode: 'gbaka',
    duration: 18,
    price: 250,
    line: 'Gbaka Adjamé Gare ➔ Abobo Gare',
    instructions: 'Prends le gbaka au terminal d\'Adjamé : "Abobo Gare ! Abobo Samaké ! 250 !". Il file par la voie express d\'Abobo jusqu\'au terminus de la gare (250 F).'
  },
  {
    id: 'edge_adj_abo_sotra',
    from: 'adj_gare_routiere',
    to: 'abo_gare',
    bidirectional: true,
    mode: 'sotra',
    duration: 26,
    price: 200,
    line: 'Bus SOTRA Ligne 03 (Adjamé Gare - Abobo Gare)',
    instructions: 'Prends le bus SOTRA ligne 03 pour relier Adjamé et Abobo par la voie express (200 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : COCODY ➔ ABOBO (Liaison transversale)
  // -------------------------------------------------------------
  {
    id: 'edge_coc_angre_abo_gare',
    from: 'coc_angre',
    to: 'abo_gare',
    bidirectional: true,
    mode: 'waren',
    duration: 16,
    price: 250,
    line: 'Wôrô-wôrô Angré ➔ Gare d\'Abobo',
    instructions: 'Prends le wôrô-wôrô jaune au château d\'Angré vers Abobo Samaké et la gare d\'Abobo (250 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : BINGERVILLE (Depuis Cocody Riviera)
  // -------------------------------------------------------------
  {
    id: 'edge_coc_r3_bin_carrefour',
    from: 'coc_riviera3',
    to: 'bin_carrefour',
    bidirectional: true,
    mode: 'gbaka',
    duration: 15,
    price: 250,
    line: 'Gbaka Cocody Riviera ➔ Carrefour Bingerville',
    instructions: 'Prends le gbaka à la station Riviera 3 : "Bingerville nouveau goudron ! 250 !". Il file le long du boulevard de Bingerville.'
  },
  {
    id: 'edge_bin_carrefour_centre',
    from: 'bin_carrefour',
    to: 'bin_centre',
    bidirectional: true,
    mode: 'waren',
    duration: 8,
    price: 200,
    line: 'Wôrô-wôrô Carrefour Bingerville ➔ Centre-ville / Jardin Botanique',
    instructions: 'Prends le wôrô-wôrô local de Bingerville jusqu\'au centre historique et l\'entrée du Jardin Botanique (200 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : ANYAMA (Depuis Abobo PK18)
  // -------------------------------------------------------------
  {
    id: 'edge_abo_pk18_anyama',
    from: 'abo_pk18',
    to: 'any_centre',
    bidirectional: true,
    mode: 'gbaka',
    duration: 16,
    price: 250,
    line: 'Gbaka Abobo PK18 ➔ Anyama Centre',
    instructions: 'Prends le gbaka au PK18 en criant "Anyama Gare ! Stade d\'Ebimpé ! 250 !". Il traverse la zone verdoyante jusqu\'au marché de la cola d\'Anyama.'
  },

  // -------------------------------------------------------------
  // LIAISON : SONGON (Depuis Yopougon Siporex / Niangon)
  // -------------------------------------------------------------
  {
    id: 'edge_yop_niangon_songon',
    from: 'yop_niangon',
    to: 'son_centre',
    bidirectional: true,
    mode: 'gbaka',
    duration: 25,
    price: 350,
    line: 'Gbaka Niangon ➔ Songon Agban',
    instructions: 'Prends le gbaka direct pour Songon à la gare de Niangon. Traversée de la route de Dabou jusqu\'à Songon Agban (350 F).'
  },

  // -------------------------------------------------------------
  // LIAISON : GRAND-BASSAM (Depuis Treichville / Port-Bouët)
  // -------------------------------------------------------------
  {
    id: 'edge_tre_bassam_gbaka',
    from: 'tre_gare',
    to: 'bas_quartier_france',
    bidirectional: true,
    mode: 'gbaka',
    duration: 38,
    price: 500,
    line: 'Gbaka Express Treichville ➔ Grand-Bassam (Quartier France)',
    instructions: 'Rends-toi à la Gare de Bassam de Treichville. Les rabatteurs crient : "Bassam plage ! Bassam Quartier France ! 500 F monnaie !". Le gbaka prend le boulevard VGE, passe l\'aéroport, file sur l\'Autoroute de Bassam et franchit le pont de la Victoire jusqu\'au Quartier France.'
  },
  {
    id: 'edge_pb_anani_bassam',
    from: 'pb_route_bassam',
    to: 'bas_quartier_france',
    bidirectional: true,
    mode: 'gbaka',
    duration: 22,
    price: 350,
    line: 'Gbaka Port-Bouët Anani ➔ Grand-Bassam',
    instructions: 'Monte dans un gbaka au Carrefour Anani sur l\'autoroute de Bassam. Trajet direct et rapide vers le Quartier France (350 F).'
  },

  // -------------------------------------------------------------
  // LIAISONS EXPRESS INTERCOMMUNALES CLÉS D'ABIDJAN
  // -------------------------------------------------------------
  {
    id: 'edge_adj_tre_gbaka',
    from: 'adj_gare_routiere',
    to: 'tre_gare',
    bidirectional: true,
    mode: 'gbaka',
    duration: 20,
    price: 300,
    line: 'Gbaka Adjamé Gare ➔ Treichville Gare de Bassam',
    instructions: 'Prends le gbaka au quai d\'Adjamé : "Treichville ! Belleville ! Gare de Bassam ! 300 monnaie !". Franchissement rapide de la lagune par le pont De Gaulle.'
  },
  {
    id: 'edge_adj_kou_gbaka',
    from: 'adj_gare_routiere',
    to: 'kou_marche',
    bidirectional: true,
    mode: 'gbaka',
    duration: 25,
    price: 350,
    line: 'Gbaka Express Adjamé Gare ➔ Koumassi Grand Marché',
    instructions: 'Prends le gbaka au terminal d\'Adjamé : "Koumassi direct ! Grand Marché ! 350 !". Traversée via le boulevard Valéry Giscard d\'Estaing.'
  },
  {
    id: 'edge_adj_mar_gbaka',
    from: 'adj_gare_routiere',
    to: 'mar_marche',
    bidirectional: true,
    mode: 'gbaka',
    duration: 22,
    price: 350,
    line: 'Gbaka Adjamé Gare ➔ Marché de Marcory',
    instructions: 'Prends le gbaka direct pour Marcory Sainte-Thérèse à la gare d\'Adjamé (350 F).'
  },
  {
    id: 'edge_adj_coc_r2_gbaka',
    from: 'adj_gare_routiere',
    to: 'coc_riviera2',
    bidirectional: true,
    mode: 'gbaka',
    duration: 18,
    price: 300,
    line: 'Gbaka Adjamé Gare ➔ Cocody Riviera 2',
    instructions: 'Monte dans le gbaka à Adjamé : "Riviera 2 ! Alpha Blondy ! 300 !". Passage express par l\'échangeur de l\'Indénié.'
  },
  {
    id: 'edge_plt_pb_sotra_aeroport',
    from: 'plt_gare_sotra',
    to: 'pb_aeroport',
    bidirectional: true,
    mode: 'sotra',
    duration: 25,
    price: 500,
    line: 'Bus SOTRA Express Ligne 203 (Plateau Sud - Aéroport FHB)',
    instructions: 'Prends le Bus Express SOTRA climatisé à la Gare Sud du Plateau. Ligne directe et confortable filant sur le Boulevard VGE jusqu\'au hall de l\'Aéroport International (500 F).'
  },
  {
    id: 'edge_tre_pb_aeroport_gbaka',
    from: 'tre_gare',
    to: 'pb_aeroport',
    bidirectional: true,
    mode: 'gbaka',
    duration: 20,
    price: 300,
    line: 'Gbaka Treichville ➔ Port-Bouët Aéroport',
    instructions: 'Prends le gbaka à la Gare de Bassam de Treichville en direction de "Port-Bouët Phare / Aéroport" (300 F).'
  },
  {
    id: 'edge_yop_kou_gbaka_express',
    from: 'yop_siporex',
    to: 'kou_marche',
    bidirectional: true,
    mode: 'gbaka',
    duration: 35,
    price: 400,
    line: 'Gbaka Express Yopougon Siporex ➔ Koumassi',
    instructions: 'Prends le grand gbaka direct à Siporex : "Koumassi direct ! Grand Marché ! 400 F !". Traversée de la ville par l\'autoroute et le pont.'
  }
];

/**
 * Guide culturel et pratique des transports ivoiriens
 */
export const TRANSPORT_GUIDE: TransportGuide = {
  title: 'Comment se déplacer à Abidjan comme un vrai Ivoirien 🇨🇮',
  intro: 'À Abidjan, les transports en commun ont leurs codes, leur argot (le Nouchi) et leurs coutumes uniques. Voici tout ce qu\'il faut savoir pour voyager sereinement et sans se faire arnaquer !',
  sections: [
    {
      id: 'gbaka',
      title: 'Le Minibus Gbaka : Le roi des grands axes',
      icon: 'assets/icons/gbaka.svg',
      color: '#e8730c',
      content: `
        <p><strong>C'est quoi ?</strong> Un minibus (souvent Toyota HiAce ou Isuzu) d'environ 18 à 22 places, reconnaissable à son porte-bagages sur le toit et son bruit de klaxon caractéristique.</p>
        <h4>Les codes du Gbaka :</h4>
        <ul>
          <li><strong>Le "Balanceur" (ou Apprenti gbaka) :</strong> C'est lui qui gère le véhicule. Suspendu à la portière ouverte, il tape des pièces de monnaie contre la carrosserie en criant la destination (ex : <em>"Adjamé Liberté 300 !"</em>). C'est à lui que tu payes ton trajet.</li>
          <li><strong>"Y a monnaie ?" :</strong> Règle d'or absolue ! N'essaye jamais de payer avec un billet de 5 000 F ou 10 000 F pour un trajet à 300 F sans demander avant de monter. L'apprenti peut refuser de te faire monter s'il n'a pas de monnaie. Aie toujours des pièces de 100, 200 et 500 F.</li>
          <li><strong>Comment descendre ?</strong> Crie fort : <em>"Apprenti, je descends au prochain poteau !"</em> ou tape sur la paroi du toit pour qu'il signale l'arrêt au chauffeur.</li>
        </ul>
      `
    },
    {
      id: 'waren',
      title: 'Le Wôrô-wôrô (Waren) : Le taxi communal incontournable',
      icon: 'assets/icons/waren.svg',
      color: '#138a4a',
      content: `
        <p><strong>C'est quoi ?</strong> Un taxi collectif qui ne circule qu'à l'intérieur d'une commune précise (ou entre deux communes immédiatement voisines). Il prend 4 passagers (1 devant, 3 derrière).</p>
        <h4>La couleur fait la commune :</h4>
        <ul>
          <li><strong>Jaune :</strong> Cocody et Adjamé</li>
          <li><strong>Vert / Vert et Blanc :</strong> Yopougon</li>
          <li><strong>Bleu :</strong> Koumassi</li>
          <li><strong>Orange / Marron :</strong> Marcory et Treichville</li>
          <li><strong>Beige / Marron clair :</strong> Abobo</li>
        </ul>
        <h4>Comment ça marche ?</h4>
        <p>Tu te mets au bord du trottoir et tu cries ta destination au chauffeur qui ralentit (ou tu fais un signe de la main). Si ça correspond à sa ligne et qu'il a de la place, il klaxonne deux fois. Le tarif est fixe (généralement 200 à 250 FCFA).</p>
      `
    },
    {
      id: 'sotra',
      title: 'Bus SOTRA : Le transport public officiel',
      icon: 'assets/icons/sotra.svg',
      color: '#2563eb',
      content: `
        <p><strong>C'est quoi ?</strong> La Société des Transports Abidjanais, le réseau public de bus d'Abidjan depuis 1960.</p>
        <h4>Les 3 services SOTRA :</h4>
        <ul>
          <li><strong>Bus Monobloc (Vert & Blanc) :</strong> Lignes ordinaires à 200 FCFA. Très économique, dessert tous les grands terminus (Gare Sud Plateau, Gare Nord Adjamé, Siporex).</li>
          <li><strong>Bus Express (Climatisés) :</strong> Lignes rapides reliant les banlieues résidentielles au Plateau via les ponts et autoroutes (500 FCFA).</li>
          <li><strong>Bateau-bus lagunaire :</strong> La traversée rapide de la lagune Ébrié évitant les embouteillages des ponts (Plateau ➔ Treichville, Cocody ➔ Treichville, Yopougon Abobodoumé ➔ Plateau).</li>
        </ul>
      `
    },
    {
      id: 'lexique',
      title: 'Petit Lexique Nouchi des Transports',
      icon: 'assets/icons/pin.svg',
      color: '#f59e0b',
      content: `
        <div class="lexique-grid">
          <div class="lexique-item">
            <span class="nouchi-word">Balanceur</span>
            <span class="nouchi-def">L'apprenti du gbaka qui appelle les clients et encaisse les sous.</span>
          </div>
          <div class="lexique-item">
            <span class="nouchi-word">Sciencer</span>
            <span class="nouchi-def">Réfléchir, analyser la meilleure route ou le meilleur tarif.</span>
          </div>
          <div class="lexique-item">
            <span class="nouchi-word">Y a jeton ?</span>
            <span class="nouchi-def">Avoir de la monnaie en pièces.</span>
          </div>
          <div class="lexique-item">
            <span class="nouchi-word">Demi-tarif</span>
            <span class="nouchi-def">Tarif réduit pour une courte distance sur la ligne de gbaka.</span>
          </div>
          <div class="lexique-item">
            <span class="nouchi-word">Dernier poteau</span>
            <span class="nouchi-def">Le terminus final de la ligne de taxi ou gbaka.</span>
          </div>
          <div class="lexique-item">
            <span class="nouchi-word">Koutoubou</span>
            <span class="nouchi-def">Le gros embouteillage abidjanais aux heures de pointe.</span>
          </div>
        </div>
      `
    }
  ]
};


