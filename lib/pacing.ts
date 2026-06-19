export type PaceStatus = 'on-track' | 'behind' | 'critical';

export interface PaceResult {
  target: number;
  done: number;
  expected: number;
  needed: number;
  gap: number;
  daysLeft: number;
  pct: number;
  status: PaceStatus;
  message: string;
}

export function calculatePace(
  target: number,
  done: number,
  expected: number,
  daysLeft: number,
  type: 'volume' | 'routine' | 'siege' | 'pipeline'
): PaceResult {
  const gap = done - expected;
  const needed = daysLeft > 0 ? Math.ceil(Math.max(0, target - done) / daysLeft) : 0;
  const pct = Math.round((done / target) * 100);
  
  let status: PaceStatus = 'on-track';
  if (gap < 0) {
    status = pct > 20 ? 'behind' : 'critical';
  }

  let message = "";
  if (type === 'volume') {
    message = gap >= 0 ? "Optimal pace maintained. Volume targets are well within execution parameters." : `Execution deficit detected. Requires ${needed} units/day to synchronize with deadline.`;
  } else if (type === 'routine') {
    message = gap >= 0 ? "Consistency matrix verified. Routine is perfectly synchronized with objectives." : `Routine variance detected. Immediate reactivation required to maintain streak integrity.`;
  } else if (type === 'siege') {
    message = gap >= 0 ? "Siege progress optimal. Fortifications are being breached as projected." : `Siege intensity required. Focus efforts to overcome defensive barriers.`;
  } else {
    message = gap >= 0 ? "Pipeline flow optimal. Throughput velocity is maintained across all stages." : `Pipeline bottleneck detected. Requires ${needed} stages/day to clear backlog.`;
  }

  return {
    target,
    done,
    expected,
    needed,
    gap,
    daysLeft,
    pct,
    status,
    message
  };
}
