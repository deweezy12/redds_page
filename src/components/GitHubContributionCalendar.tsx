import ReactEChartsCore from "echarts-for-react/lib/core";
import { HeatmapChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import type { EChartsCoreOption } from "echarts/core";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";

echarts.use([GridComponent, HeatmapChart, TooltipComponent, SVGRenderer]);

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type GitHubContributionMonth = {
  label: string;
  weekIndex: number;
};

export type GitHubContributionCell = {
  date: string;
  weekIndex: number;
  weekday: number;
  count: number;
  level: ContributionLevel;
};

export type GitHubContributionSnapshot = {
  username: string;
  generatedAt: string;
  totalContributions: number;
  weekCount: number;
  months: GitHubContributionMonth[];
  cells: GitHubContributionCell[];
};

const LEVEL_COLORS: Record<ContributionLevel, string> = {
  0: "#0d1117",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const LEGEND_LEVELS: ContributionLevel[] = [0, 1, 2, 3, 4];

type ChartPoint = {
  value: [number, (typeof WEEKDAYS)[number], number];
  itemStyle: {
    color: string;
  };
  meta: GitHubContributionCell;
};

function formatContributionDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function buildChartOption(data: GitHubContributionSnapshot): EChartsCoreOption {
  const monthLabels = new Map(data.months.map((month) => [month.weekIndex, month.label]));
  const weeks = Array.from({ length: data.weekCount }, (_, index) => index);

  return {
    animation: false,
    grid: {
      left: 30,
      right: 0,
      top: 24,
      bottom: 6,
      containLabel: false,
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#161b22",
      borderColor: "#30363d",
      borderWidth: 1,
      textStyle: {
        color: "#f0f6fc",
        fontSize: 12,
      },
      extraCssText: "box-shadow:none;padding:8px 10px;border-radius:8px;",
      formatter: (params: unknown) => {
        const item = (params as { data?: ChartPoint }).data?.meta;
        if (!item) return "";
        return `${formatContributionDate(item.date)}<br/>${item.count} contribution${item.count === 1 ? "" : "s"}`;
      },
    },
    xAxis: {
      type: "category",
      position: "top",
      data: weeks,
      boundaryGap: true,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        interval: 0,
        color: "rgba(255,255,255,0.32)",
        fontFamily: "monospace",
        fontSize: 10,
        margin: 8,
        formatter: (value: string | number) => monthLabels.get(Number(value)) ?? "",
      },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: [...WEEKDAYS],
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: "rgba(255,255,255,0.3)",
        fontFamily: "monospace",
        fontSize: 10,
        margin: 10,
        formatter: (value: string) => (value === "Mon" || value === "Wed" || value === "Fri" ? value : ""),
      },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "cartesian2d",
        progressive: 0,
        itemStyle: {
          borderColor: "rgba(255,255,255,0.05)",
          borderWidth: 1,
          borderRadius: 2,
        },
        emphasis: {
          itemStyle: {
            borderColor: "#f0f6fc",
            borderWidth: 1,
          },
        },
        data: data.cells.map((cell) => ({
          value: [cell.weekIndex, WEEKDAYS[cell.weekday], cell.count],
          itemStyle: {
            color: LEVEL_COLORS[cell.level],
          },
          meta: cell,
        })),
      },
    ],
  };
}

export function GitHubContributionCalendar({ data }: { data: GitHubContributionSnapshot }) {
  const chartWidth = Math.max(data.weekCount * 13 + 36, 640);
  const chartOption = buildChartOption(data);

  return (
    <div>
      <div className="overflow-x-auto pb-3">
        <ReactEChartsCore
          echarts={echarts}
          option={chartOption}
          notMerge
          lazyUpdate
          opts={{ renderer: "svg" }}
          style={{ width: `${chartWidth}px`, height: "150px" }}
        />
      </div>
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/6">
        <p className="text-white/40 text-xs font-mono tracking-wide">{data.totalContributions} contributions in the last year</p>
        <div className="flex items-center gap-2">
          <span className="text-white/20 text-[10px] font-mono uppercase tracking-[0.18em]">Less</span>
          {LEGEND_LEVELS.map((level) => (
            <span
              key={level}
              className="block w-[10px] h-[10px] rounded-[2px] border border-white/6"
              style={{ background: LEVEL_COLORS[level] }}
              aria-hidden="true"
            />
          ))}
          <span className="text-white/20 text-[10px] font-mono uppercase tracking-[0.18em]">More</span>
        </div>
      </div>
    </div>
  );
}
