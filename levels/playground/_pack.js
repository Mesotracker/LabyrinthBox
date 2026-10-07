// The Playground levels use two furniture sets that live in the Phobia Wing pack
// file; a level pack is self-contained, so they are repeated here.
LabLevels.packExtra('playground', {
  items: { ticket: 'Ride Ticket', token: 'Arcade Token' },
  props: {
  nursery: {
    wall: [['bed', 0.03], ['C:dresser', 0.03], ['C:nightstand', 0.03], ['lamp_floor', 0.01], ['balloons', 0.01, 0, () => ({ top: 2.0 })]],
    floor: [['C:present', [1, 3], (rng) => ({ mat: rng.pick(['gift_red', 'gift_blue', 'gift_green']) })], ['chair_plastic', [1, 3]], ['C:box', [0, 2]], ['table', [0, 1]]],
  },
  theater: {
    wall: [['painting', 0.04, 1.55], ['lamp_floor', 0.02], ['C:cabinet', 0.012, 1.15, { mat: 'wood_dark' }], ['couch', 0.01]],
    floor: [['pedestal', [2, 5]], ['rope_posts', [1, 3]], ['bench', [1, 3], { mat: 'wood_dark' }], ['C:crate', [0, 2]]],
  },
  },
});
