"use client";

type Spike = {
  theme: string;
  current: number;
  previous: number;
  increase: number;
};

export default function SpikeDetection({
  spikes,
}: {
  spikes: Spike[];
}) {
  if (!spikes.length) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold">
          Spike Detection
        </h2>

        <p className="mt-4 text-gray-400">
          No significant spikes detected.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          🔥 Spike Detection
        </h2>

        <p className="mt-2 text-gray-400">
          Detect sudden increases in customer feedback trends.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {spikes.map((spike) => {

          let severity = "🟢 Stable";
          let badge =
            "bg-green-500/10 text-green-300 border-green-500/20";

          if (spike.increase >= 150) {
            severity = "🔴 Critical";
            badge =
              "bg-red-500/10 text-red-300 border-red-500/20";
          } else if (spike.increase >= 75) {
            severity = "🟠 High";
            badge =
              "bg-orange-500/10 text-orange-300 border-orange-500/20";
          } else if (spike.increase >= 30) {
            severity = "🟡 Medium";
            badge =
              "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
          }

          return (

            <div
              key={spike.theme}
              className="rounded-2xl border border-white/10 bg-black/20 p-6 transition hover:border-blue-500/30"
            >

              <div className="flex items-center justify-between">

                <h3 className="text-lg font-semibold">
                  {spike.theme}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs ${badge}`}
                >
                  {severity}
                </span>

              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div>

                  <p className="text-xs text-gray-400">
                    Yesterday
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {spike.previous}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Today
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {spike.current}
                  </p>

                </div>

              </div>

              <div className="mt-6 flex items-center gap-2">

                <span className="text-2xl text-green-400">
                  ↑
                </span>

                <span className="text-xl font-bold text-green-400">
                  +{spike.increase}%
                </span>

              </div>

              <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">

                <p className="text-sm text-blue-300">

                  <strong>Recommendation:</strong>{" "}

                  Investigate the recent increase in{" "}
                  <strong>{spike.theme}</strong> related
                  customer feedback.

                </p>

              </div>

            </div>

          );
        })}

      </div>

    </section>
  );
}