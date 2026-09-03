/**
 * CoalGuard Mine Master Dataset
 *
 * Exact list of statutory mines/collieries configured across the MineGuard platform.
 */
export interface MineInfo {
  id: string;
  code: string;
  name: string;
  fullLabel: string;
  subsidiary: string;
  state: string;
  type: 'Underground' | 'Opencast';
  defaultArea: string;
  defaultLevel: string;
  defaultPanel: string;
}

export const MINES: MineInfo[] = [
  {
    id: 'BCCL-JHR-01',
    code: 'BCCL-JHR-01',
    name: 'BCCL Moonidih Deep Underground Colliery',
    fullLabel: 'BCCL Moonidih Deep Underground Colliery (BCCL-JHR-01)',
    subsidiary: 'Bharat Coking Coal Limited (BCCL)',
    state: 'Jharkhand',
    type: 'Underground',
    defaultArea: 'Underground Longwall Section A',
    defaultLevel: '-280m',
    defaultPanel: 'ML-04',
  },
  {
    id: 'SECL-KRB-02',
    code: 'SECL-KRB-02',
    name: 'SECL Gevra Mega Opencast Project',
    fullLabel: 'SECL Gevra Mega Opencast Project (SECL-KRB-02)',
    subsidiary: 'South Eastern Coalfields Limited (SECL)',
    state: 'Chhattisgarh',
    type: 'Opencast',
    defaultArea: 'Opencast Pit 2 — Highwall Face',
    defaultLevel: '+140m RL',
    defaultPanel: 'HW-08',
  },
  {
    id: 'NCL-SNG-03',
    code: 'NCL-SNG-03',
    name: 'NCL Jayant Opencast Colliery',
    fullLabel: 'NCL Jayant Opencast Colliery (NCL-SNG-03)',
    subsidiary: 'Northern Coalfields Limited (NCL)',
    state: 'Madhya Pradesh',
    type: 'Opencast',
    defaultArea: 'Dragline Bench 3',
    defaultLevel: '+180m RL',
    defaultPanel: 'DL-02',
  },
  {
    id: 'MCL-TLR-04',
    code: 'MCL-TLR-04',
    name: 'MCL Bhubaneswari Opencast Mine',
    fullLabel: 'MCL Bhubaneswari Opencast Mine (MCL-TLR-04)',
    subsidiary: 'Mahanadi Coalfields Limited (MCL)',
    state: 'Odisha',
    type: 'Opencast',
    defaultArea: 'Surface Mining Sector B',
    defaultLevel: '+110m RL',
    defaultPanel: 'SM-11',
  },
  {
    id: 'ECL-RNG-05',
    code: 'ECL-RNG-05',
    name: 'ECL Sodepur Underground Colliery',
    fullLabel: 'ECL Sodepur Underground Colliery (ECL-RNG-05)',
    subsidiary: 'Eastern Coalfields Limited (ECL)',
    state: 'West Bengal',
    type: 'Underground',
    defaultArea: 'Dishergarh Seam 4',
    defaultLevel: '-220m',
    defaultPanel: 'DG-06',
  },
];

export const DEFAULT_MINE = MINES[0];
