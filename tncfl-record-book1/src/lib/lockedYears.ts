// Which seasons have formally passed their own review — distinct from the
// Milestone 15 TEMPLATE lock (that's a one-time event; this is the same
// concept applied per-season, exactly as the roadmap called for). This is
// an editorial decision, not something the engine computes, so it lives as
// a plain list here rather than in site_data.json — add a year the moment
// its own review is confirmed, during the Milestone 16 rollout.
export const LOCKED_YEARS = new Set<number>([2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025])
