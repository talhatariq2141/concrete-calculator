// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/calculators/gravel-calculators",
        destination: "/calculators/gravel",
        permanent: true,
      },
      {
        source: "/calculators/gravel-calculators/:slug",
        destination: "/calculators/gravel/:slug",
        permanent: true,
      },
      {
        source: "/calculators/slab-concrete-calculator",
        destination: "/calculators/slab/slab-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/concrete-slab-cost-calculator",
        destination: "/calculators/slab/concrete-slab-cost-calculator",
        permanent: true,
      },
      {
        source: "/calculators/concrete-slab-weight-calculator",
        destination: "/calculators/slab/concrete-slab-weight-calculator",
        permanent: true,
      },
      {
        source: "/calculators/concrete-slab-load-capacity-calculator",
        destination: "/calculators/slab/concrete-slab-load-capacity-calculator",
        permanent: true,
      },
      {
        source: "/calculators/concrete-block-calculator",
        destination: "/calculators/concrete-block/concrete-block-calculator",
        permanent: true,
      },
      {
        source: "/calculators/cinder-block-calculator",
        destination: "/calculators/concrete-block/cinder-block-calculator",
        permanent: true,
      },
      {
        source: "/calculators/cmu-block-calculator",
        destination: "/calculators/concrete-block/cmu-block-calculator",
        permanent: true,
      },
      {
        source: "/calculators/reinforcement-and-structural/rebar-calculator",
        destination: "/calculators/reinforcement/rebar-calculator",
        permanent: true,
      },
      {
        source: "/calculators/reinforcement-and-structural/wire-mesh-calculator",
        destination: "/calculators/reinforcement/wire-mesh-calculator",
        permanent: true,
      },
      {
        source: "/calculators/reinforcement-and-structural/rebar-weight-calculator",
        destination: "/calculators/reinforcement/rebar-weight-calculator",
        permanent: true,
      },
      {
        source: "/calculators/reinforcement-and-structural/rebar-spacing-calculator",
        destination: "/calculators/reinforcement/rebar-spacing-calculator",
        permanent: true,
      },
      {
        source: "/calculators/flatwork-and-surface/concrete-sidewalk-calculator",
        destination: "/calculators/slab/concrete-sidewalk-calculator",
        permanent: true,
      },
      {
        source: "/calculators/post-hole-concrete-calculator",
        destination: "/calculators/miscellaneous/post-hole-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/crushed-concrete-calculator",
        destination: "/calculators/miscellaneous/crushed-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/concrete-driveway-cost-calculator",
        destination: "/calculators/driveway/concrete-driveway-cost-calculator",
        permanent: true,
      },
      {
        source: "/calculators/concrete-yards-calculator",
        destination: "/calculators/concrete-yards/concrete-yards-calculator",
        permanent: true,
      },
      {
        source: "/calculators/footing-concrete-calculator",
        destination: "/calculators/footing/footing-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/nominal-mix-m5-m25-calculator",
        destination: "/calculators/concrete-mix/nominal-mix-m5-m25-calculator",
        permanent: true,
      },
      {
        source: "/calculators/pier-caisson-concrete-calculator",
        destination: "/calculators/pier-caisson/pier-caisson-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/beam-concrete-calculator",
        destination: "/calculators/beam/beam-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/column-concrete-calculator",
        destination: "/calculators/column/column-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/concrete-bag-calculator",
        destination: "/calculators/concrete-bags/concrete-bag-calculator",
        permanent: true,
      },
      {
        source: "/calculators/staircase-concrete-calculator",
        destination: "/calculators/staircase/staircase-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/tank-trench-concrete-calculator",
        destination: "/calculators/tank-trench/tank-trench-concrete-calculator",
        permanent: true,
      },
      {
        source: "/calculators/wall-concrete-calculator",
        destination: "/calculators/wall/wall-concrete-calculator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
