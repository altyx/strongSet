import { restToResume } from '@/src/domain/rest';

const NOW = 1_760_000_000_000;

describe('restToResume', () => {
  it('reprend un repos pas encore fini de la même séance', () => {
    const stored = { workoutId: 3, endsAt: NOW + 45_000, duration: 90 };
    expect(restToResume(stored, 3, NOW)).toEqual(stored);
  });

  it('ignore un repos fini, d’une autre séance ou illisible', () => {
    expect(restToResume({ workoutId: 3, endsAt: NOW, duration: 90 }, 3, NOW)).toBeNull();
    expect(restToResume({ workoutId: 2, endsAt: NOW + 45_000, duration: 90 }, 3, NOW)).toBeNull();
    expect(restToResume({ workoutId: 3, endsAt: 'demain', duration: 90 }, 3, NOW)).toBeNull();
    expect(restToResume(undefined, 3, NOW)).toBeNull();
    expect(restToResume('repos', 3, NOW)).toBeNull();
  });
});
