"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

const openingFrames = [
  ["01", "/italy-monza-2026/route-assets/opening/web/01.webp", 0, .15, "50%", "50%"],
  ["04", "/italy-monza-2026/route-assets/opening/web/04.webp", .15, .15, "50%", "38%"],
  ["13", "/italy-monza-2026/route-assets/opening/web/13.webp", .30, .11, "50%", "50%"],
  ["07", "/italy-monza-2026/route-assets/opening/web/07.webp", .41, .12, "55%", "50%"],
  ["18", "/italy-monza-2026/route-assets/opening/web/18.webp", .53, .12, "50%", "54%"],
  ["03", "/italy-monza-2026/route-assets/opening/web/03.webp", .65, .14, "50%", "34%"],
  ["09", "/italy-monza-2026/route-assets/opening/web/09.webp", .79, .15, "50%", "50%"],
  ["06", "/italy-monza-2026/route-assets/opening/web/06.webp", .94, .13, "50%", "50%"],
  ["17", "/italy-monza-2026/route-assets/opening/web/17.webp", 1.07, .14, "50%", "50%"],
  ["11", "/italy-monza-2026/route-assets/opening/web/11.webp", 1.21, .18, "50%", "50%"],
  ["14", "/italy-monza-2026/route-assets/opening/web/14.webp", 1.39, .17, "55%", "50%"],
  ["02", "/italy-monza-2026/route-assets/opening/web/02.webp", 1.56, .20, "38%", "42%"],
  ["08", "/italy-monza-2026/route-assets/opening/web/08.webp", 1.76, .21, "50%", "50%"],
  ["05", "/italy-monza-2026/route-assets/opening/web/05.webp", 1.97, .15, "50%", "50%"],
  ["15", "/italy-monza-2026/route-assets/opening/web/15.webp", 2.12, .28, "50%", "50%"],
] as const;

type OpeningMode = "boot" | "playing" | "title" | "exiting" | "entered";

const days = [
  ["8/30", "日", "抵達 MXP", false],
  ["8/31", "一", "Maranello", true],
  ["9/1", "二", "Barbaresco", false],
  ["9/2", "三", "Barolo", false],
  ["9/3", "四", "Asti", false],
  ["9/4", "五", "Casale・Milano", false],
  ["9/5", "六", "Monza 排位", false],
  ["9/6", "日", "Monza 正賽", false],
  ["9/7", "一", "Milano", false],
  ["9/8", "二", "Milano・MXP", false],
] as const;

const routes = [
  ["pickup", "01", "租車上路", "08:00", "租車上路"],
  ["museum", "02", "法拉利博物館", "MUSEO FERRARI", "法拉利博物館"],
  ["gate", "03", "Ferrari 經典大門", "FACTORY GATE", "經典大門"],
  ["lunch", "04", "法拉利餐廳", "12:30", "法拉利餐廳"],
  ["neive", "05", "前往紅酒山谷", "LANGHE · NEIVE", "紅酒山谷"],
] as const;

const legs = [
  ["drive", "約 2 小時 30 分", "235 km"],
  ["drive", "約 5 分鐘", ""],
  ["walk", "步行約 1–2 分鐘", ""],
  ["drive", "約 3 小時", ""],
] as const;

const shortLegs = ["2h30", "5m", "1–2m", "3h"] as const;

const ferrariProps: Record<string, string> = {
  pickup: "/italy-monza-2026/route-assets/ferrari-prop-pickup-v1.png",
  museum: "/italy-monza-2026/route-assets/ferrari-prop-museum-v1.png",
  gate: "/italy-monza-2026/route-assets/ferrari-prop-gate-v1.png",
  lunch: "/italy-monza-2026/route-assets/ferrari-prop-lunch-v1.png",
  neive: "/italy-monza-2026/route-assets/ferrari-prop-neive-v1.png",
};

type WineRoute = readonly [string, string, string, string, string];
type WineLegData = readonly ["walk" | "drive" | "train", string];

const wineRoutes: readonly WineRoute[] = [
  ["01", "Barbaresco", "紅酒塔", "", "oak"],
  ["02", "Barbaresco", "品酒", "", "wine"],
  ["03", "Neive 老城", "", "Piazza Italia · 鐘樓 · 城堡丘 · Donna Selvatica", "oak town"],
  ["04", "Romano Levi", "蒸餾坊", "", "vine"],
] as const;

const wineLegs: readonly WineLegData[] = [
  ["walk", "步行"],
  ["drive", "6–10 分"],
  ["walk", "步行"],
] as const;

const wineRouteTargets = ["barbaresco-tower", "barbaresco-tasting", "neive-old-town", "romano-levi"] as const;

const baroloRoutes: readonly WineRoute[] = [
  ["01", "La Morra", "山城", "葡萄園觀景 · 在地甜點 · Barolo 選酒", "oak town"],
  ["02", "Barolo 酒莊", "午餐品酒", "", "wine"],
  ["03", "Barolo", "老城", "酒莊選酒 · 開瓶器小店", "oak"],
  ["04", "Grinzane", "城堡", "榛果甜點 · Piemonte 伴手禮", "vine"],
] as const;
const baroloLegs: readonly WineLegData[] = [["drive", "15–20 分"], ["drive", "約 10 分"], ["drive", "8–10 分"]] as const;
const baroloTargets = ["la-morra", "fontanafredda", "barolo-old-town", "grinzane"] as const;

const astiRoutes: readonly WineRoute[] = [
  ["01", "Asti", "早晨市集", "", "oak"],
  ["02", "Asti", "老城", "大教堂 · 老街 · 古塔 · 主廣場", "wine town"],
  ["03", "百年巧克力", "工房參觀", "", "vine"],
  ["04", "Asti 杏仁", "下午茶", "", "oak"],
] as const;
const astiLegs: readonly WineLegData[] = [["walk", "步行"], ["walk", "步行"], ["walk", "步行"]] as const;
const astiTargets = ["asti-market", "asti-old-town", "barbero", "giordanino"] as const;

const travelRoutes = [
  ["krumiri", ["國王餅乾", "午餐"], "CASALE MONFERRATO"],
  ["return", ["機場還車"], "MXP · TERMINAL 1"],
  ["checkin", ["米蘭 Airbnb", "Check-in"], "VIA MELCHIORRE GIOIA 69"],
  ["ferrari-store", ["Monza 前夜祭", "Ferrari 旗艦店"], "MILANO CENTRO"],
  ["gelato", ["★ 買樂樂冰"], "ESSELUNGA"],
] as const;

const travelEdges = [
  ["自駕", "1h05"],
  ["自駕", "1h10"],
  ["Malpensa Express", "50–51 分"],
  ["M3", "Duomo"],
  ["Metro", "Gioia"],
] as const;

const pitStops = [
  ["airbnb", "01", "米蘭 Airbnb", "出發", "hard"],
  ["monza", "02", "Monza", "速度的殿堂", "hard"],
  ["village", "03", "F1 Village", "買週邊", "medium"],
  ["fp3", "04", "FP3", "10:30–11:30", "medium"],
  ["qualifying", "05", "排位賽", "14:00–15:00", "soft"],
] as const;

type MilanRouteStop = readonly [string, string, string, string];

const milanCityStops: readonly MilanRouteStop[] = [
  ["duomo-breakfast", "★ 麥當勞早餐看大教堂", "06:30", "01"],
  ["duomo-square", "★ 米蘭大教堂", "07:15", "02"],
  ["galleria", "★ Galleria 長廊", "07:15–08:15", "03"],
  ["duomo-rooftop", "★ 爬去屋頂上", "09:00", "04"],
  ["starbucks-milan", "★ 米蘭星巴克", "10:10", "05"],
  ["brera", "★ Brera 小店慢逛＋午餐", "11:00–13:45", "06"],
  ["castello", "☆ 米蘭城堡＋公園散步", "14:00–16:15", "07"],
] as const;

const milanCityEdges = [
  "步行｜1–2 分",
  "步行｜1–2 分",
  "步行｜3–5 分",
  "步行｜8–10 分",
  "步行｜15–20 分",
  "步行｜12–15 分",
] as const;

const milanDepartureStops: readonly MilanRouteStop[] = [
  ["centrale-drop", "Centrale 寄行李", "退房後", "01"],
  ["pave", "米蘭早午餐", "Pavé", "02"],
  ["orsonero", "買咖啡豆", "上午", "03"],
  ["last-lunch", "午餐", "12:30", "04"],
  ["centrale-pickup", "取行李去機場", "13:45–14:30", "05"],
  ["flight-home", "回家囉｜19:45 TK1876", "MXP T1", "06"],
] as const;

const milanDepartureEdges = [
  "步行｜15–20 分",
  "步行｜10–15 分",
  "步行｜8–12 分",
  "步行｜15–20 分",
  "14:55 首選｜約 51 分",
] as const;

function CarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17h14l-1.2-6.2A2 2 0 0 0 15.84 9H8.16a2 2 0 0 0-1.96 1.8L5 17Z" /><path d="M4 17h16v2H4z" /><circle cx="7" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 7l5 5-5 5" /></svg>;
}

function RouteLeg({ index, turn = false }: { index: number; turn?: boolean }) {
  const leg = legs[index];
  if (!leg) return null;
  return (
    <div className={turn ? "route-leg route-turn" : "route-leg"}>
      {leg[0] === "drive" ? <CarIcon /> : <ArrowIcon />}
      <strong className="leg-full">{leg[1]}</strong>
      <strong className="leg-short">{shortLegs[index]}</strong>
      {leg[2] && <span>{leg[2]}</span>}
    </div>
  );
}

function WineLeg({ leg, turn = false, reverse = false }: { leg: WineLegData; turn?: boolean; reverse?: boolean }) {
  if (!leg) return null;
  return (
    <div className={`wine-leg${turn ? " wine-turn" : ""}${reverse ? " reverse" : ""}`}>
      <img className="wine-vine" src="/italy-monza-2026/route-assets/grapevine-connector.png" alt="" aria-hidden="true" />
      {leg[0] === "drive" ? <CarIcon /> : <ArrowIcon />}
      <strong>{leg[1]}</strong>
    </div>
  );
}

function WineStartLeg({ label, turn = false }: { label: string; turn?: boolean }) {
  return (
    <div className={`wine-leg wine-start-leg${turn ? " wine-turn" : ""}`}>
      <img className="wine-vine" src="/italy-monza-2026/route-assets/grapevine-connector.png" alt="" aria-hidden="true" />
      <CarIcon />
      <strong>{label}</strong>
    </div>
  );
}

function WineStartNode({ startArt = "/italy-monza-2026/route-assets/neive-house.png" }: { startArt?: string }) {
  const hasMorningArt = startArt.includes("morning");
  return (
    <div className={`wine-start-node${hasMorningArt ? " has-morning-art" : ""}`} aria-label="Neive 住宿出發">
      <img src={startArt} alt="" aria-hidden="true" />
      <strong>Neive 住宿出發</strong>
    </div>
  );
}

function WineBarrelNode({ route, targetId }: { route: WineRoute; targetId: string }) {
  const [number, title, titleSecond, sub, variant] = route;
  const asset = variant.includes("wine") ? "barrel-wine.png" : variant.includes("vine") ? "barrel-vine.png" : "barrel-oak.png";
  const variantClasses = variant.split(" ").map((item) => `wine-node-${item}`).join(" ");
  const selectWineStop = () => document.getElementById(`wine-card-${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <button type="button" className={`wine-node ${variantClasses}`} aria-label={`查看${title}${titleSecond}細節`} onClick={selectWineStop}>
      <img src={`/italy-monza-2026/route-assets/${asset}`} alt="" aria-hidden="true" />
      <span className="wine-node-copy">
        <span className="wine-number">{number}</span>
        <strong>{title}</strong>
        {titleSecond && <strong>{titleSecond}</strong>}
        {sub && <small>{sub}</small>}
      </span>
    </button>
  );
}

function WineRouteIndex({ routeData, targetIds, legData, startLabel, returnLabel, startArt }: {
  routeData: readonly WineRoute[];
  targetIds: readonly string[];
  legData: readonly WineLegData[];
  startLabel: string;
  returnLabel?: string;
  startArt?: string;
}) {
  return (
    <>
      <div className="wine-index wine-index-desktop">
        <WineStartNode startArt={startArt} />
        <WineStartLeg label={startLabel} />
        {routeData.map((route, index) => (
          <Fragment key={route[0]}>
            <WineBarrelNode route={route} targetId={targetIds[index]} />
            {index < routeData.length - 1 && <WineLeg leg={legData[index]} />}
          </Fragment>
        ))}
        {returnLabel && <span className="wine-return-label">回 Neive · {returnLabel}</span>}
      </div>
      <div className="wine-index-mobile">
        <div className="wine-mobile-start">
          <WineStartNode startArt={startArt} />
          <WineStartLeg label={startLabel} turn />
        </div>
        <div className="wine-mobile-row">
          <WineBarrelNode route={routeData[0]} targetId={targetIds[0]} />
          <WineLeg leg={legData[0]} />
          <WineBarrelNode route={routeData[1]} targetId={targetIds[1]} />
        </div>
        <div className="wine-mobile-turn"><WineLeg leg={legData[1]} turn /></div>
        <div className="wine-mobile-row reverse">
          <WineBarrelNode route={routeData[2]} targetId={targetIds[2]} />
          <WineLeg leg={legData[2]} reverse />
          <WineBarrelNode route={routeData[3]} targetId={targetIds[3]} />
        </div>
        {returnLabel && <span className="wine-return-label mobile">回 Neive · {returnLabel}</span>}
      </div>
    </>
  );
}

function FerrariRouteNode({ route, index }: { route: typeof routes[number]; index: number }) {
  const [id, number, label, sub, mobileLabel] = route;
  const reverse = index >= 3;
  const selectRoute = () => document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <button type="button" className={`ferrari-car-node ferrari-car-node-${id} ferrari-position-${index + 1}`} onClick={selectRoute} aria-label={`查看${label}細節`}>
      <img className={`ferrari-car-art${reverse ? " reverse" : ""}`} src="/italy-monza-2026/route-assets/ferrari-roadster-v1.png" alt="" aria-hidden="true" />
      <img className="ferrari-prop-art" src={ferrariProps[id]} alt="" aria-hidden="true" />
      <span className="ferrari-car-copy">
        <span className="ferrari-car-number">{number}</span>
        <strong className="ferrari-label-desktop">{label}</strong>
        <strong className="ferrari-label-mobile">{mobileLabel}</strong>
        <small>{sub}</small>
      </span>
    </button>
  );
}

function FerrariRouteIndex() {
  return (
    <div className="ferrari-route-index" aria-label="8 月 31 日路線：租車上路、法拉利博物館、Ferrari 經典大門、法拉利餐廳、前往紅酒山谷">
      <img className="ferrari-track-art" src="/italy-monza-2026/route-assets/ferrari-route-track-v1.png" alt="" aria-hidden="true" />
      {routes.map((route, index) => <FerrariRouteNode key={route[0]} route={route} index={index} />)}
      <span className="ferrari-track-time ferrari-time-1">2h30</span>
      <span className="ferrari-track-time ferrari-time-2">5m</span>
      <span className="ferrari-track-time ferrari-time-3">1–2m</span>
      <span className="ferrari-track-time ferrari-time-4">3h</span>
    </div>
  );
}

type WineDetailCardProps = {
  id: string;
  number: string;
  time: string;
  displayName: string;
  officialName: string;
  mapUrl: string;
  meta?: string[];
  children: React.ReactNode;
};

function WineDetailCard({ id, number, time, displayName, officialName, mapUrl, meta = [], children }: WineDetailCardProps) {
  return (
    <article id={`wine-card-${id}`} className="wine-detail-card">
      <div className="wine-detail-number"><span>{number}</span><small>{time}</small></div>
      <div className="wine-detail-body">
        <h3>{displayName}</h3>
        <a className="wine-detail-link" href={mapUrl} target="_blank" rel="noreferrer">
          <span>{officialName}</span><ArrowIcon />
        </a>
        {meta.length > 0 && <div className="wine-detail-meta">{meta.map((item) => <span key={item}>{item}</span>)}</div>}
        <div className="wine-detail-content">{children}</div>
      </div>
    </article>
  );
}

type WineHeroProps = {
  ariaLabel: string;
  day: string;
  date: string;
  letter: string;
  word: string;
  region: string;
  routeLabel: string;
  places: string;
  summary: string;
  routeData: readonly WineRoute[];
  targetIds: readonly string[];
  legData: readonly WineLegData[];
  startLabel: string;
  returnLabel?: string;
  startArt?: string;
};

function WineHero({ ariaLabel, day, date, letter, word, region, routeLabel, places, summary, routeData, targetIds, legData, startLabel, returnLabel, startArt }: WineHeroProps) {
  return (
    <section className="wine-route-section" aria-label={ariaLabel}>
      <div className="wine-theme-card">
        <img className="wine-country-art" src="/italy-monza-2026/route-assets/wine-country-background.png" alt="" aria-hidden="true" />
        <div className="wine-theme-word" aria-hidden="true"><span>{letter}</span><strong>{word}</strong></div>
        <div className="wine-card-content">
          <div className="eyebrow-row wine-eyebrow"><span>DAY {day}</span><span className="eyebrow-line" /><span>{date}</span></div>
          <div className="wine-theme-note"><span>{region}</span><strong>{routeLabel}</strong></div>
          <div className="wine-meta-row"><span>{places}</span><p>{summary}</p></div>
          <WineRouteIndex routeData={routeData} targetIds={targetIds} legData={legData} startLabel={startLabel} returnLabel={returnLabel} startArt={startArt} />
        </div>
      </div>
    </section>
  );
}

function WineDetailsHeading({ day, description }: { day: string; description: string }) {
  return <div className="wine-details-heading"><span>DETAILS / DAY {day}</span><h2 id="wine-details-title">行程細節</h2><p>{description}</p></div>;
}

function LinkedStop({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return <li><a href={href} target="_blank" rel="noreferrer"><strong>{title}</strong>{sub && <small>{sub}</small>}</a></li>;
}

function ShopStop({ href, title, officialName, note }: { href: string; title: string; officialName: string; note?: string }) {
  return <li className="shop-stop"><a href={href} target="_blank" rel="noreferrer"><strong>{title}</strong><small>{officialName}</small>{note && <em>{note}</em>}</a></li>;
}

function LunchNote({ title, note }: { title: string; note: string }) {
  return (
    <aside className="wine-lunch-note" aria-label={`午餐：${title}`}>
      <span>午餐</span>
      <div><strong>{title}</strong><p>{note}</p></div>
    </aside>
  );
}

function WineDayPrototype() {
  return (
    <>
      <WineHero ariaLabel="9 月 1 日 Barbaresco 與 Neive 行程索引" day="03" date="01 SEP 2026" letter="B" word="ARBARESCO" region="LANGHE · PIEMONTE" routeLabel="WINE ROUTE 02" places="BARBARESCO · NEIVE" summary="紅酒塔・品酒・老城・蒸餾坊" routeData={wineRoutes} targetIds={wineRouteTargets} legData={wineLegs} startLabel="6–10 分" startArt="/italy-monza-2026/route-assets/neive-morning-human-0901-v2.png" />
      <section className="wine-details-section" aria-labelledby="wine-details-title">
        <WineDetailsHeading day="3" description="Barbaresco 的上午，接著慢慢走回 Neive。" />
        <div className="wine-details-list">
          <WineDetailCard id="barbaresco-tower" number="01" time="上午" displayName="Barbaresco 紅酒塔" officialName="Torre di Barbaresco" mapUrl="https://www.google.com/maps/search/?api=1&query=Torre+di+Barbaresco+Via+Torino+12050+Barbaresco" meta={["免預約", "45–60 分"]}>
            <dl className="wine-facts">
              <div><dt>地址</dt><dd>Via Torino, Barbaresco</dd></div>
              <div><dt>入場</dt><dd>€6</dd></div>
              <div><dt>開放</dt><dd>10:00–18:00</dd></div>
            </dl>
          </WineDetailCard>

          <WineDetailCard id="barbaresco-tasting" number="02" time="接著" displayName="Barbaresco 品酒" officialName="Enoteca Regionale del Barbaresco" mapUrl="https://www.google.com/maps/search/?api=1&query=Enoteca+Regionale+del+Barbaresco+Piazza+del+Municipio+7+Barbaresco" meta={["現場品飲", "45–60 分"]}>
            <dl className="wine-facts">
              <div><dt>地址</dt><dd>Piazza del Municipio 7</dd></div>
              <div><dt>時間</dt><dd>10:00–18:00</dd></div>
              <div><dt>安排</dt><dd>2 位・不需預約</dd></div>
            </dl>
          </WineDetailCard>

          <LunchNote title="Barbaresco 或 Neive 彈性午餐" note="不綁餐廳，依當天步調決定。" />

          <WineDetailCard id="neive-old-town" number="03" time="下午" displayName="Neive 老城" officialName="Neive Centro Storico" mapUrl="https://www.google.com/maps/search/?api=1&query=Neive+Centro+Storico" meta={["自助散步"]}>
            <ol className="old-town-route" aria-label="Neive 老城散步順序">
              <LinkedStop href="https://www.google.com/maps/search/?api=1&query=Piazza+Italia+12052+Neive+CN" title="Piazza Italia" />
              <LinkedStop href="https://www.google.com/maps/search/?api=1&query=Torre+dell%27Orologio+Via+Giachino+12+Neive" title="Neive 鐘樓" sub="Torre dell’Orologio" />
              <LinkedStop href="https://www.google.com/maps/search/?api=1&query=Belvedere+della+Salita+al+Castello+Neive" title="城堡丘・觀景點" sub="Belvedere della Salita al Castello" />
              <LinkedStop href="https://www.google.com/maps/search/?api=1&query=Museo+Casa+della+Donna+Selvatica+Neive" title="Donna Selvatica" sub="Museo Casa della Donna Selvatica" />
            </ol>
          </WineDetailCard>

          <WineDetailCard id="romano-levi" number="04" time="下午後段" displayName="Romano Levi 蒸餾坊" officialName="Distilleria Romano Levi" mapUrl="https://www.google.com/maps/search/?api=1&query=Distilleria+Romano+Levi+Via+XX+Settembre+91+Neive" meta={["免費參觀", "45–60 分"]}>
            <dl className="wine-facts">
              <div><dt>地址</dt><dd>Via XX Settembre 91</dd></div>
              <div><dt>週二</dt><dd>09:00–12:00・14:00–18:00</dd></div>
              <div><dt>安排</dt><dd>個人參觀・非強制預約</dd></div>
            </dl>
          </WineDetailCard>
        </div>
        <p className="wine-day-rhythm"><span>今日節奏</span> 優先保留紅酒塔、品酒與 Neive 老城；時間不足再調整 Romano Levi。</p>
      </section>
      <footer className="prototype-footer"><span>ITALY · MONZA 2026</span><p>9/1 Barbaresco · Neive</p></footer>
    </>
  );
}

function BaroloDayPrototype() {
  return (
    <>
      <WineHero ariaLabel="9 月 2 日 Barolo 酒鄉行程索引" day="04" date="02 SEP 2026" letter="B" word="AROLO" region="LANGHE · PIEMONTE" routeLabel="WINE ROUTE 03" places="LA MORRA · BAROLO · GRINZANE" summary="山城・酒莊午餐品酒・老城・城堡" routeData={baroloRoutes} targetIds={baroloTargets} legData={baroloLegs} startLabel="約 25 分" returnLabel="17–20 分" startArt="/italy-monza-2026/route-assets/02_morning_coffee.png" />
      <section className="wine-details-section">
        <WineDetailsHeading day="4" description="固定時段留給 Fontanafredda，前後用酒鄉小鎮串起來。" />
        <div className="wine-details-list">
          <WineDetailCard id="la-morra" number="01" time="上午" displayName="La Morra 山城" officialName="La Morra Centro" mapUrl="https://www.google.com/maps/search/?api=1&query=La+Morra+CN" meta={["順路優先"]}>
            <ol className="old-town-route stop-list"><LinkedStop href="https://www.google.com/maps/search/?api=1&query=Belvedere+di+La+Morra+Piazza+Castello+12064+La+Morra+CN" title="葡萄園觀景" sub="Belvedere di La Morra・Piazza Castello" /></ol>
            <ul className="shop-grid" aria-label="La Morra 採買店家"><ShopStop href="https://www.google.com/maps/search/?api=1&query=Laboratorio+Pasticceria+Cogno+La+Morra" title="☆ 在地甜點" officialName="Laboratorio Pasticceria Cogno" /><ShopStop href="https://www.google.com/maps/search/?api=1&query=Cantina+Comunale+di+La+Morra" title="☆ Barolo 選酒" officialName="Cantina Comunale di La Morra" /></ul>
          </WineDetailCard>
          <LunchNote title="13:00 Fontanafredda 酒莊午餐" note="Osteria Disguido・3 道輕食＋2 款酒，15:00 接續英文酒窖導覽。" />
          <WineDetailCard id="fontanafredda" number="02" time="13:00" displayName="Barolo 酒莊午餐品酒" officialName="Fontanafredda・Villaggio Narrante" mapUrl="https://www.google.com/maps/search/?api=1&query=Fontanafredda+Villaggio+Narrante" meta={["已付款", "待確認信"]}>
            <dl className="wine-facts"><div><dt>午餐</dt><dd>13:00・Osteria Disguido</dd></div><div><dt>酒窖導覽</dt><dd>15:00・英文場</dd></div><div><dt>結束</dt><dd>約 16:30</dd></div><div><dt>內容</dt><dd>3 道輕食＋2 款酒</dd></div><div><dt>品飲</dt><dd>導覽＋3 款酒</dd></div><div><dt>兩人合計</dt><dd>€160</dd></div></dl>
          </WineDetailCard>
          <WineDetailCard id="barolo-old-town" number="03" time="下午" displayName="Barolo 老城" officialName="Barolo Centro Storico" mapUrl="https://www.google.com/maps/search/?api=1&query=Barolo+Centro+Storico" meta={["彈性停留"]}>
            <ul className="shop-grid" aria-label="Barolo 採買店家"><ShopStop href="https://www.google.com/maps/search/?api=1&query=Damilano+Wine+Shop+Barolo" title="☆ 酒莊選酒" officialName="Damilano Wine Shop" /><ShopStop href="https://www.google.com/maps/search/?api=1&query=Marcarini+Wine+Shop+Barolo" title="Marcarini 選酒" officialName="Marcarini Wine Shop" note="有時間再去" /><ShopStop href="https://www.google.com/maps/search/?api=1&query=Museo+dei+Cavatappi+Barolo" title="開瓶器小店" officialName="Museo dei Cavatappi Shop" note="有時間再去" /></ul>
          </WineDetailCard>
          <WineDetailCard id="grinzane" number="04" time="傍晚" displayName="Grinzane 城堡" officialName="Castello di Grinzane Cavour" mapUrl="https://www.google.com/maps/search/?api=1&query=Castello+di+Grinzane+Cavour" meta={["採買重點"]}>
            <ul className="shop-grid" aria-label="Grinzane 必去採買"><ShopStop href="https://www.google.com/maps/search/?api=1&query=Antica+Torroneria+Piemontese+Loc.+Piana+Gallo+48" title="★ 榛果甜點" officialName="Antica Torroneria Piemontese" /><ShopStop href="https://www.google.com/maps/search/?api=1&query=Enoteca+Regionale+Piemontese+Cavour+Via+Castello+5" title="★ Piemonte 伴手禮" officialName="Enoteca Regionale Piemontese Cavour" /></ul>
          </WineDetailCard>
        </div>
        <p className="wine-day-rhythm"><span>今日節奏</span> 13:00 午餐與 15:00 酒窖導覽優先；其餘小鎮依現場時間縮放。</p>
      </section>
      <footer className="prototype-footer"><span>ITALY · MONZA 2026</span><p>9/2 La Morra · Barolo · Grinzane</p></footer>
    </>
  );
}

function AstiDayPrototype() {
  return (
    <>
      <WineHero ariaLabel="9 月 3 日 Asti 行程索引" day="05" date="03 SEP 2026" letter="A" word="STI" region="MONFERRATO · PIEMONTE" routeLabel="WINE ROUTE 04" places="ASTI" summary="早晨市集・老城・巧克力工房・杏仁下午茶" routeData={astiRoutes} targetIds={astiTargets} legData={astiLegs} startLabel="約 25 分" startArt="/italy-monza-2026/route-assets/03_cat_morning_stretch.png" />
      <section className="wine-details-section">
        <WineDetailsHeading day="5" description="先逛 Asti 的日常，再把下午留給百年甜點工房。" />
        <div className="wine-details-list">
          <WineDetailCard id="asti-market" number="01" time="上午" displayName="Asti 早晨市集" officialName="Mercato Coperto di Asti" mapUrl="https://www.google.com/maps/search/?api=1&query=Mercato+Coperto+di+Asti+Piazza+Liberta" meta={["30–45 分"]}><dl className="wine-facts"><div><dt>地點</dt><dd>Piazza Libertà</dd></div><div><dt>停車</dt><dd>Piazza Campo del Palio</dd></div><div><dt>預留</dt><dd>停車付款＋步行 15–20 分</dd></div><div><dt>順路 bonus</dt><dd>Piazza Catena 在地生產者市集</dd></div></dl></WineDetailCard>
          <WineDetailCard id="asti-old-town" number="02" time="中午前" displayName="Asti 老城" officialName="Asti Centro Storico" mapUrl="https://www.google.com/maps/search/?api=1&query=Asti+Centro+Storico" meta={["自助散步"]}>
            <ol className="old-town-route stop-list"><LinkedStop href="https://www.google.com/maps/search/?api=1&query=Cattedrale+di+Asti" title="Asti 大教堂" /><LinkedStop href="https://www.google.com/maps/search/?api=1&query=Corso+Alfieri+Asti" title="Corso Alfieri" /><LinkedStop href="https://www.google.com/maps/search/?api=1&query=Torre+Troyana+Asti" title="Piazza Roma・Torre Troyana" /><LinkedStop href="https://www.google.com/maps/search/?api=1&query=Piazza+San+Secondo+Asti" title="Piazza San Secondo・Piazza Alfieri" /></ol>
            <div className="shop-section"><span>老城沿線店家</span><ul className="shop-grid"><ShopStop href="https://www.google.com/maps/search/?api=1&query=Enoteca+Tomedo+Asti" title="☆ Asti 產地伴手禮塔" officialName="Enoteca Tomedo" /><ShopStop href="https://www.google.com/maps/search/?api=1&query=Enoteca+Pompa+Magna+Asti" title="☆ Piemonte 酒舖" officialName="Enoteca Pompa Magna" /><ShopStop href="https://www.google.com/maps/search/?api=1&query=Gastronomia+San+Secondo+Asti" title="在地熟食小店" officialName="Gastronomia San Secondo" note="有時間再去" /><ShopStop href="https://www.google.com/maps/search/?api=1&query=Ricambi+d%27Arte+Asti" title="布料蕾絲家飾老店" officialName="Ricambi d’Arte" note="有時間再去" /></ul></div>
          </WineDetailCard>
          <LunchNote title="Asti 老城午餐" note="Campanarò 優先；Osteria del Diavolo、La Douia 備選。" />
          <WineDetailCard id="barbero" number="03" time="15:00" displayName="百年巧克力工房參觀" officialName="D. Barbero Private Experience" mapUrl="https://www.google.com/maps/search/?api=1&query=D.+Barbero+Via+Angelo+Brofferio+84+Asti" meta={["已付款", "申請確認中"]}><dl className="wine-facts"><div><dt>集合</dt><dd>提早 15–20 分抵達</dd></div><div><dt>內容</dt><dd>歷史工房・Torrone・巧克力品飲</dd></div><div><dt>兩人合計</dt><dd>€50</dd></div></dl></WineDetailCard>
          <WineDetailCard id="giordanino" number="04" time="參觀後" displayName="Asti 杏仁下午茶" officialName="Pasticceria Giordanino 1912" mapUrl="https://www.google.com/maps/search/?api=1&query=Pasticceria+Giordanino+1912+Asti" meta={["Polentina"]}><dl className="wine-facts"><div><dt>必吃</dt><dd>Polentina delle Tre Mandorle</dd></div></dl></WineDetailCard>
        </div>
        <p className="wine-day-rhythm"><span>今日節奏</span> 15:00 D. Barbero 是固定主軸；Palio 期間交通與 Piazza Alfieri 工程需多留緩衝。</p>
      </section>
      <footer className="prototype-footer"><span>ITALY · MONZA 2026</span><p>9/3 Asti</p></footer>
    </>
  );
}

function TravelConnector({ index }: { index: number }) {
  const [mode, time] = travelEdges[index];
  return (
    <div className={`travel-connector travel-edge-${index + 1}`} aria-label={`${mode} ${time}`}>
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 17 C26 7 58 26 92 14" />
        <path className="travel-arrowhead" d="M84 8 L94 14 L86 22" />
      </svg>
      <span><strong>{mode}</strong><small>{time}</small></span>
    </div>
  );
}

function TravelTagNode({ route, index }: { route: typeof travelRoutes[number]; index: number }) {
  const [id, labelLines, sub] = route;
  const label = labelLines.join(" ");
  const selectStop = () => document.getElementById(`wine-card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <button type="button" className={`travel-node travel-node-${index + 1}`} onClick={selectStop} aria-label={`查看${label}細節`}>
      <img className="travel-tag-art" src="/italy-monza-2026/route-assets/travel-luggage-tag.png" alt="" aria-hidden="true" />
      <span className={`travel-prop travel-prop-${index + 1}`} aria-hidden="true" />
      <span className="travel-node-copy"><strong>{labelLines.map((line) => <span key={line}>{line}</span>)}</strong><small>{sub}</small></span>
    </button>
  );
}

function TravelDayPrototype() {
  return (
    <>
      <section className="travel-route-section" aria-label="9 月 4 日 Casale Monferrato 到米蘭行程索引">
        <div className="travel-theme-card">
          <img className="travel-background-art" src="/italy-monza-2026/route-assets/wine-to-milan-background.png" alt="" aria-hidden="true" />
          <div className="wine-theme-word travel-theme-word" aria-hidden="true"><span>C</span><strong>ASALE</strong></div>
          <div className="wine-card-content travel-card-content">
            <div className="eyebrow-row wine-eyebrow"><span>DAY 06</span><span className="eyebrow-line" /><span>04 SEP 2026</span></div>
            <div className="wine-theme-note"><span>PIEMONTE → LOMBARDIA</span><strong>TRAVEL ROUTE 05</strong></div>
            <div className="wine-meta-row travel-meta-row"><span>CASALE · MXP · MILANO</span><p>國王餅乾・還車・入住・前夜祭・樂樂冰</p></div>
            <div className="travel-index">
              <div className="travel-start"><img src="/italy-monza-2026/route-assets/04_packing_luggage_taiwan_passport.png" alt="" aria-hidden="true" /><strong>Neive 住宿出發</strong></div>
              {travelRoutes.map((route, index) => <Fragment key={route[0]}><TravelConnector index={index} /><TravelTagNode route={route} index={index} /></Fragment>)}
            </div>
          </div>
        </div>
      </section>
      <section className="wine-details-section travel-details-section">
        <WineDetailsHeading day="6" description="從酒鄉收行李，經機場還車後切換成米蘭城市節奏。" />
        <div className="wine-details-list">
          <LunchNote title="Casale Monferrato 彈性午餐" note="先買國王餅乾，再依抵達時間安排午餐。" />
          <WineDetailCard id="krumiri" number="01" time="上午" displayName="★ 國王餅乾與午餐" officialName="Pasticceria Krumiri Rossi" mapUrl="https://www.google.com/maps/search/?api=1&query=Pasticceria+Krumiri+Rossi+Via+Giovanni+Lanza+17+Casale+Monferrato" meta={["★ 必去", "午餐彈性"]}><dl className="wine-facts"><div><dt>地址</dt><dd>Via Giovanni Lanza 17</dd></div><div><dt>停車首選</dt><dd>Piazza Castello</dd></div><div><dt>備選</dt><dd>Via Sant&apos;Anna</dd></div></dl></WineDetailCard>
          <WineDetailCard id="return" number="02" time="15:30–16:30" displayName="機場還車" officialName="Europcar Malpensa Airport T1" mapUrl="https://www.google.com/maps/search/?api=1&query=Europcar+Malpensa+Airport+Terminal+1" meta={["目標時段", "原訂 18:00"]}><dl className="wine-facts"><div><dt>還車航廈</dt><dd>Terminal 1</dd></div><div><dt>還車前</dt><dd>加油・清空車內・拍照</dd></div><div><dt>快線上車</dt><dd>Malpensa Aeroporto T1</dd></div><div><dt>快線下車</dt><dd>Milano Centrale・約 50–51 分</dd></div></dl></WineDetailCard>
          <WineDetailCard id="checkin" number="03" time="傍晚" displayName="米蘭 Airbnb Check-in" officialName="Via Melchiorre Gioia 69" mapUrl="https://www.google.com/maps/search/?api=1&query=Via+Melchiorre+Gioia+69+Milano" meta={["4 晚"]}><dl className="wine-facts"><div><dt>Malpensa Express</dt><dd>Malpensa Aeroporto T1 → Milano Centrale・50–51 分</dd></div><div><dt>接續地鐵</dt><dd>Centrale FS M3（往 Comasina）→ Sondrio</dd></div><div><dt>出站</dt><dd>Via Melchiorre Gioia 71；住宿為 69 號</dd></div><div><dt>地址</dt><dd>Via Melchiorre Gioia 69</dd></div></dl></WineDetailCard>
          <WineDetailCard id="ferrari-store" number="04" time="入住後" displayName="Monza 前夜祭與 Ferrari 旗艦店" officialName="Ferrari Flagship Store Milano" mapUrl="https://www.google.com/maps/search/?api=1&query=Ferrari+Flagship+Store+Via+Berchet+2+Milano" meta={["每日 10:00–20:00", "20:00 前抵達才前往"]}><dl className="wine-facts"><div><dt>地址</dt><dd>Via Berchet 2</dd></div><div><dt>地鐵上車</dt><dd>Sondrio M3・往 San Donato</dd></div><div><dt>地鐵下車</dt><dd>Duomo M3・步行約 4 分</dd></div><div><dt>時間不足</dt><dd>直接略過，不挪到 9/7</dd></div></dl><p className="detail-note">保留米蘭市區 F1 氣氛與活動的彈性，不把整晚綁死在單一活動。Ferrari 旗艦店是明確停靠點；若無法在 20:00 前抵達則略過，不挪至 9/7。</p></WineDetailCard>
          <WineDetailCard id="gelato" number="05" time="晚間" displayName="★ 買樂樂冰" officialName="Esselunga di Porta Nuova" mapUrl="https://www.google.com/maps/search/?api=1&query=Esselunga+di+Porta+Nuova+Viale+Don+Luigi+Sturzo+13+Milano" meta={["★ 必去", "庫存現場確認"]}><dl className="wine-facts"><div><dt>地鐵路線</dt><dd>Duomo M3（往 Comasina）→ Centrale FS；轉 M2（往 Assago／Abbiategrasso）→ Gioia</dd></div><div><dt>地址</dt><dd>Viale Don Luigi Sturzo 13・下車後步行</dd></div><div><dt>採買後</dt><dd>步行回 Via Melchiorre Gioia 69</dd></div><div><dt>若缺貨</dt><dd>9/7 再補買</dd></div></dl></WineDetailCard>
        </div>
        <p className="wine-day-rhythm"><span>今日節奏</span> 還車與入住是主軸；Ferrari 旗艦店依抵達時間取捨，樂樂冰保留第二次採買機會。</p>
      </section>
      <footer className="prototype-footer"><span>ITALY · MONZA 2026</span><p>9/4 Casale Monferrato · Milano</p></footer>
    </>
  );
}

function PitTireNode({ stop, index }: { stop: typeof pitStops[number]; index: number }) {
  const [id, number, title, sub, compound] = stop;
  const selectStop = () => document.getElementById(`pit-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <button
      type="button"
      className={`pit-stop-node pit-stop-${index + 1} pit-compound-${compound}`}
      onClick={selectStop}
      aria-label={`查看${title}${sub}細節`}
      style={{ "--pit-delay": `${1.45 + index * .16}s` } as React.CSSProperties}
    >
      <span className="pit-tire-art" aria-hidden="true" />
      <span className="pit-board-copy"><small>{number}</small><strong>{title}</strong><em>{sub}</em></span>
    </button>
  );
}

function PitDayPrototype() {
  const [replayKey, setReplayKey] = useState(0);
  return (
    <>
      <section className="pit-route-section" aria-label="9 月 5 日 Monza 排位賽日行程索引">
        <div className="pit-theme-card">
          <div className="pit-grid-overlay" aria-hidden="true" />
          <div className="pit-card-content">
            <div className="eyebrow-row pit-eyebrow"><span>DAY 07</span><span className="eyebrow-line" /><span>05 SEP 2026</span></div>
            <div className="pit-theme-note"><span>AUTODROMO NAZIONALE MONZA</span><strong>PIT LANE 05</strong></div>
            <div className="pit-title-row"><div><span>MONZA</span><h1>QUALIFYING DAY</h1></div><p>速度的殿堂・F1 Village・FP3・排位賽</p></div>

            <div key={replayKey} className="pit-animation-stage">
              <div className="pit-box-marking" aria-hidden="true"><i /><i /><i /><i /></div>
              <img className="pit-crew-art" src="/italy-monza-2026/route-assets/monza-pit-crew.png" alt="" aria-hidden="true" />
              <img className="pit-car-top-art" src="/italy-monza-2026/route-assets/monza-pit-car.png" alt="" aria-hidden="true" />
              <div className="pit-stop-index">
                {pitStops.map((stop, index) => <PitTireNode key={stop[0]} stop={stop} index={index} />)}
              </div>
              <div className="pit-release-light" aria-hidden="true"><span /><span /><span /></div>
            </div>

            <button type="button" className="pit-replay" onClick={() => setReplayKey((value) => value + 1)} aria-label="重播無聲進站動畫">
              <span aria-hidden="true">↻</span> REPLAY PIT STOP
            </button>
          </div>
        </div>
      </section>

      <section className="pit-details-section" aria-labelledby="pit-details-title">
        <div className="pit-details-heading"><span>PIT WALL / DAY 7</span><div><h2 id="pit-details-title">排位賽日控制板</h2><p>整天留在 Monza，按照場內節奏逐步升溫。</p></div></div>

        <div className="pit-session-strip" aria-label="9 月 5 日主要時間">
          <span><small>ENTRY</small><strong>08:00</strong><em>票面時間</em></span>
          <i />
          <span><small>FP3</small><strong>10:30</strong><em>至 11:30</em></span>
          <i />
          <span className="active"><small>QUALIFYING</small><strong>14:00</strong><em>至 15:00</em></span>
        </div>

        <article id="pit-airbnb" className="pit-wall-panel pit-panel-transport">
          <div className="pit-panel-label"><span>01</span><small>GET TO THE TRACK</small></div>
          <div className="pit-panel-body">
            <h3>米蘭 Airbnb → Monza｜速度的殿堂</h3>
            <p className="pit-route-summary">火車＋Black Shuttle</p>
            <div className="pit-transit-flow" aria-label="前往 Monza 的完整交通順序">
              <span><small>住宿</small><strong>Via Melchiorre Gioia 69</strong></span><i>→</i>
              <span><small>火車上車</small><strong>Milano Centrale</strong></span><i>→</i>
              <span><small>火車下車</small><strong>Monza FS</strong></span><i>→</i>
              <span><small>接駁</small><strong>Black Shuttle</strong></span><i>→</i>
              <a href="https://www.google.com/maps/search/?api=1&query=Autodromo+Nazionale+Monza" target="_blank" rel="noreferrer"><small>抵達</small><strong>Autodromo Nazionale Monza</strong></a>
            </div>
            <p className="pit-operating-note">車站內以 Trenord App 的車次與目的地對照 Partenze 看板及 Binario，確認列車停靠 Monza；抵達後跟隨 Uscita／GP／Navetta Nera／Autodromo 指標。</p>
          </div>
        </article>

        <article id="pit-monza" className="pit-wall-panel pit-panel-ticket">
          <div className="pit-panel-label"><span>02</span><small>TRACK PASS</small></div>
          <div className="pit-panel-body">
            <h3>Monza｜速度的殿堂</h3>
            <dl className="pit-ticket-grid"><div><dt>星期六票</dt><dd>2 張・eTicket</dd></div><div><dt>票種</dt><dd>Settore 8／Intero P</dd></div><div><dt>入場</dt><dd>Ingresso Circolare Prato</dd></div><div><dt>票面</dt><dd>08:00</dd></div></dl>
          </div>
        </article>

        <article id="pit-village" className="pit-wall-panel pit-panel-trackday">
          <div className="pit-panel-label"><span>03–04</span><small>TRACK DAY</small></div>
          <div className="pit-panel-body">
            <div className="pit-track-grid">
              <div><span>F1 VILLAGE</span><h3>先逛周邊與 Fanzone</h3><p>入場後先處理 Ferrari／Monza 紀念品與場內活動，再把固定時間留給賽道。</p></div>
              <div id="pit-fp3"><span>FREE PRACTICE 3</span><h3>FP3｜10:30–11:30</h3><p>熟悉賽道與週六現場動線，氣氛開始升溫。</p></div>
            </div>
            <aside className="pit-lunch-note"><span>PIT STOP 午餐</span><strong>場內餐飲・補水・休息</strong><p>FP3 後依現場步調安排，不離開賽道。</p></aside>
          </div>
        </article>

        <article id="pit-qualifying" className="pit-wall-panel pit-panel-qualifying">
          <div className="pit-panel-label"><span>05</span><small>MAXIMUM ATTACK</small></div>
          <div className="pit-panel-body"><span className="pit-soft-label">SOFT / RED</span><h3>排位賽｜14:00–15:00</h3><p>今日速度最高點。排位結束後不急著衝向出口，等第一波人潮稍退，再沿 Black Shuttle → Monza FS → Milano Centrale 原路返回。</p></div>
        </article>
      </section>
      <footer className="prototype-footer pit-footer"><span>ITALY · MONZA 2026</span><p>9/5 Monza Qualifying Day</p></footer>
    </>
  );
}

type RaceLaunchMode = "car" | "halo";

function RaceStartScene({ onFinish, launchMode }: { onFinish: () => void; launchMode: RaceLaunchMode }) {
  const [lights, setLights] = useState(0);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const reducedMotionTimer = window.setTimeout(() => {
        setLights(5);
        onFinish();
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const timers = [
      window.setTimeout(() => setLights(1), 3800),
      window.setTimeout(() => setLights(2), 4800),
      window.setTimeout(() => setLights(3), 5800),
      window.setTimeout(() => setLights(4), 6800),
      window.setTimeout(() => setLights(5), 7800),
      window.setTimeout(() => { setLights(0); setLaunched(true); }, 9200),
      window.setTimeout(onFinish, 10800),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [onFinish]);

  return (
    <div className={`race-start-scene race-view-${launchMode}${launched ? " is-launched" : ""}`}>
      <div className="race-sky" aria-hidden="true">
        <div className="race-flyover-formation">
          <img className="race-flyover-clouds" src="/italy-monza-2026/route-assets/monza-tricolor-flyover.png" alt="" />
          <span className="race-cloud-plane race-cloud-plane-green">✈</span>
          <span className="race-cloud-plane race-cloud-plane-white">✈</span>
          <span className="race-cloud-plane race-cloud-plane-red">✈</span>
        </div>
      </div>
      <div className="race-opening-copy" aria-hidden="true"><span>RACE DAY</span><strong>MONZA</strong><small>06 SEP 2026</small></div>
      <div className="race-track" aria-hidden="true">
        <span className="race-track-barrier race-track-barrier-left" />
        <span className="race-track-barrier race-track-barrier-right" />
        <span className="race-start-finish-line" />
        <span className="race-grid-slot race-grid-slot-1" />
        <span className="race-grid-slot race-grid-slot-2" />
        <span className="race-grid-slot race-grid-slot-3" />
        <span className="race-grid-slot race-grid-slot-4" />
        <span className="race-grid-slot race-grid-slot-5" />
        <span className="race-grid-slot race-grid-slot-6" />
      </div>
      <div className="race-light-gantry" aria-label={`${lights} 組紅燈亮起`}>
        <div className="race-gantry-sign" aria-hidden="true"><img src="/italy-monza-2026/route-assets/f1-logo-red.svg" alt="" /></div>
        <div className="race-gantry-truss" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="race-light-bank">
          {[1, 2, 3, 4, 5].map((number) => <span key={number} className={lights >= number ? "is-on" : ""}><i /><i /></span>)}
        </div>
        <div className="race-gantry-post race-gantry-post-left" aria-hidden="true" />
        <div className="race-gantry-post race-gantry-post-right" aria-hidden="true" />
      </div>
      <div className="race-lights-out" aria-hidden="true">LIGHTS OUT</div>
      {launchMode === "car" ? (
        <img className="race-launch-car" src="/italy-monza-2026/route-assets/monza-pit-car.png" alt="" aria-hidden="true" />
      ) : (
        <>
          <img className="race-halo-cockpit" src="/italy-monza-2026/route-assets/monza-halo-cockpit.png" alt="" aria-hidden="true" />
          <img className="race-launch-car race-halo-cut-car" src="/italy-monza-2026/route-assets/monza-pit-car.png" alt="" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

function RaceDayPrototype({ onExit }: { onExit: () => void }) {
  const [replayKey, setReplayKey] = useState(0);
  const [finished, setFinished] = useState(false);
  const [launchMode, setLaunchMode] = useState<RaceLaunchMode>("car");
  const finish = useCallback(() => setFinished(true), []);
  const replay = () => { setFinished(false); setReplayKey((value) => value + 1); };
  const changeLaunchMode = (mode: RaceLaunchMode) => {
    setLaunchMode(mode);
    setFinished(false);
    setReplayKey((value) => value + 1);
  };

  return (
    <section className={`race-day-section${finished ? " is-finished" : ""}`} aria-label="9 月 6 日 Monza 正賽日動畫">
      <RaceStartScene key={replayKey} onFinish={finish} launchMode={launchMode} />
      <div className="race-finish-frame">
        <picture className="race-poster-picture">
          <source media="(max-width: 760px)" srcSet="/italy-monza-2026/route-assets/monza-race-poster-mobile-16.webp" />
          <img src="/italy-monza-2026/route-assets/monza-race-poster-desktop.avif" alt="" />
        </picture>
        <div className="race-poster-shade" aria-hidden="true" />
        <div className="race-poster-copy race-poster-copy-desktop">
          <span>RACE DAY</span>
          <strong>06 SEP 2026</strong>
          <small>ITALIAN GRAND PRIX</small>
        </div>
        <div className="race-poster-copy race-poster-copy-mobile">
          <span>RACE DAY</span>
          <strong>06 SEP</strong>
          <small>2026 · MONZA</small>
        </div>
      </div>
      <div className="race-view-controls" aria-label="選擇起跑視角">
        <button type="button" className="race-days-exit" onClick={onExit}>← DAYS</button>
        <span className="race-view-divider" aria-hidden="true" />
        <button type="button" className={launchMode === "car" ? "is-active" : ""} aria-pressed={launchMode === "car"} onClick={() => changeLaunchMode("car")}>CAR VIEW</button>
        <button type="button" className={launchMode === "halo" ? "is-active" : ""} aria-pressed={launchMode === "halo"} onClick={() => changeLaunchMode("halo")}>HALO VIEW</button>
      </div>
      <button type="button" className="race-skip" onClick={finish}>SKIP INTRO</button>
      <button type="button" className="race-replay" onClick={replay}><span aria-hidden="true">↻</span> REPLAY START</button>
    </section>
  );
}

type CardProps = {
  id: string;
  number: string;
  time: string;
  displayName: string;
  officialName: string;
  mapUrl?: string;
  meta?: string[];
  children: React.ReactNode;
};

function ItineraryCard({ id, number, time, displayName, officialName, mapUrl, meta = [], children }: CardProps) {
  return (
    <article id={`card-${id}`} className="wine-detail-card ferrari-detail-card">
      <div className="wine-detail-number ferrari-detail-number"><span>{number}</span><small>{time}</small></div>
      <div className="wine-detail-body ferrari-detail-body">
        <h3>{displayName}</h3>
        {mapUrl ? (
          <a className="wine-detail-link ferrari-detail-link" href={mapUrl} target="_blank" rel="noreferrer">
            <span>{officialName}</span><ArrowIcon />
          </a>
        ) : <span className="wine-detail-link plain">{officialName}</span>}
        {meta.length > 0 && <div className="wine-detail-meta ferrari-detail-meta">{meta.map((item) => <span key={item}>{item}</span>)}</div>}
        <div className="wine-detail-content ferrari-detail-content">{children}</div>
      </div>
    </article>
  );
}

function FlightStage({ id, image, title, sub, className }: { id: string; image: string; title: string; sub: string; className: string }) {
  const selectStage = () => document.getElementById(`flight-card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <button type="button" className={`flight-stage ${className}`} onClick={selectStage} aria-label={`查看${title}細節`}>
      <span className="flight-art-wrap"><img src={image} alt="" aria-hidden="true" /></span>
      <span className="flight-stage-copy"><strong>{title}</strong><small>{sub}</small></span>
    </button>
  );
}

function FlightDayPrototype() {
  return (
    <>
      <section className="flight-route-section" aria-label="8 月 30 日台北出發、伊斯坦堡轉機、抵達米蘭行程索引">
        <div className="flight-theme-card">
          <div className="flight-theme-word" aria-hidden="true"><span>F</span><strong>LIGHT</strong></div>
          <div className="flight-card-content">
            <div className="eyebrow-row flight-eyebrow"><span>DAY 01</span><span className="eyebrow-line" /><span>30 AUG 2026</span></div>
            <div className="flight-theme-note"><span>TAIWAN → ITALY</span><strong>DEPARTURE ROUTE 00</strong></div>
            <div className="flight-meta-row"><span>TPE · IST · MXP</span><p>停車・飛航・轉機・機場飯店</p></div>

            <div className="flight-journey">
              <svg className="flight-route-line" viewBox="0 0 1100 280" preserveAspectRatio="none" aria-hidden="true">
                <path d="M105 210 C265 204 303 86 494 104 C674 122 714 222 986 205" />
                <path className="flight-route-arrow" d="M966 193 L994 205 L970 222" />
              </svg>
              <FlightStage id="parking" image="/italy-monza-2026/route-assets/taiwan-departure.png" title="台灣出發" sub="TPE · 09:35" className="flight-stage-taiwan" />
              <div className="flight-plane-stage">
                <FlightStage id="flights" image="/italy-monza-2026/route-assets/transfer-airplane.png" title="長途飛航" sub="TPE → IST → MXP" className="flight-stage-plane" />
                <span className="airplane-belly-label"><small>TRANSIT</small><strong>IST</strong><em>轉機 4h40</em></span>
              </div>
              <FlightStage id="hotel" image="/italy-monza-2026/route-assets/italy-arrival-luggage.png" title="抵達米蘭" sub="MXP T1 · 23:45" className="flight-stage-arrival" />
            </div>

            <div className="flight-time-ribbon" aria-label="8 月 30 日飛行時間摘要">
              <span><small>TAIPEI</small><strong>09:35</strong></span>
              <i />
              <span><small>ISTANBUL</small><strong>17:10 · 21:50</strong></span>
              <i />
              <span><small>MILANO</small><strong>23:45</strong></span>
            </div>
          </div>
        </div>
      </section>

      <section className="flight-details-section" aria-labelledby="flight-details-title">
        <div className="flight-details-heading"><span>DETAILS / DAY 1</span><h2 id="flight-details-title">出發日細節</h2><p>先把車停好，兩段飛行後直接住進機場飯店。</p></div>
        <div className="flight-details-list">
          <article id="flight-card-parking" className="travel-document parking-pass">
            <div className="document-tab"><span>01</span><small>PARKING</small></div>
            <div className="document-body">
              <span className="document-kicker">TAIWAN / DEPARTURE</span>
              <h3>桃園機場停車</h3>
              <a href="https://www.google.com/maps/search/?api=1&query=%E6%97%A5%E6%9C%88%E4%BA%AD%E5%B9%B3%E5%AE%89%E5%81%9C%E8%BB%8A%E5%A0%B4+%E6%A1%83%E5%9C%92%E5%B8%82%E5%A4%A7%E5%9C%92%E5%8D%80%E5%B9%B3%E5%AE%89%E8%B7%AF157%E8%99%9F" target="_blank" rel="noreferrer">日月亭平安停車場 <ArrowIcon /></a>
              <dl className="document-facts"><div><dt>預約日期</dt><dd>8/30–9/9</dd></div><div><dt>服務時間</dt><dd>24 小時・全年無休</dd></div><div><dt>地址</dt><dd>桃園市大園區平安路 157 號旁</dd></div><div><dt>位置</dt><dd>非航廈內停車場</dd></div></dl>
            </div>
          </article>

          <article id="flight-card-flights" className="travel-document boarding-document">
            <div className="document-tab"><span>02</span><small>FLIGHTS</small></div>
            <div className="document-body">
              <span className="document-kicker">TURKISH AIRLINES / TWO LEGS</span>
              <h3>台北飛往米蘭</h3>
              <div className="boarding-passes">
                <div className="boarding-pass"><span className="flight-number">TK125</span><div><strong>TPE</strong><small>09:35</small></div><i>→</i><div><strong>IST</strong><small>17:10</small></div></div>
                <div className="transfer-stamp"><small>TRANSFER</small><strong>4 小時 40 分</strong></div>
                <div className="boarding-pass"><span className="flight-number">TK1877</span><div><strong>IST</strong><small>21:50</small></div><i>→</i><div><strong>MXP</strong><small>23:45</small></div></div>
              </div>
              <dl className="document-facts compact"><div><dt>托運行李</dt><dd>30 kg</dd></div><div><dt>手提行李</dt><dd>1 件・8 kg</dd></div><div><dt>抵達</dt><dd>Malpensa Terminal 1</dd></div></dl>
            </div>
          </article>

          <article id="flight-card-hotel" className="travel-document hotel-key-card">
            <div className="document-tab"><span>03</span><small>HOTEL</small></div>
            <div className="document-body">
              <span className="document-kicker">MXP / FIRST NIGHT</span>
              <h3>抵達後入住機場飯店</h3>
              <a href="https://www.google.com/maps/search/?api=1&query=Moxy+Milan+Malpensa+Airport+Terminal+2" target="_blank" rel="noreferrer">Moxy Milan Malpensa Airport <ArrowIcon /></a>
              <dl className="document-facts"><div><dt>位置</dt><dd>Malpensa Terminal 2</dd></div><div><dt>入住</dt><dd>15:00 起</dd></div><div><dt>退房</dt><dd>翌日 12:00 前</dd></div><div><dt>翌日</dt><dd>08:00 前往 T1 取車</dd></div></dl>
              <p className="hotel-transfer-note"><strong>T1 → T2</strong> 領完行李後依現場指標前往 Terminal 2；深夜以航廈接駁為主，班次於出發前 24–48 小時複核。飯店就在 T2 外。</p>
            </div>
          </article>
        </div>
      </section>
      <footer className="prototype-footer flight-footer"><span>ITALY · MONZA 2026</span><p>8/30 Taipei · Istanbul · Milano</p></footer>
    </>
  );
}

function MilanRouteIndex({ stops, edges, morningImage, morningLabel, departure = false }: {
  stops: readonly MilanRouteStop[];
  edges: readonly string[];
  morningImage: string;
  morningLabel: string;
  departure?: boolean;
}) {
  return (
    <div className={`milan-index-composition${departure ? " departure" : ""}`}>
      <div className="milan-morning-start">
        <img src={morningImage} alt="" aria-hidden="true" />
        <strong>{morningLabel}</strong>
        <span>{departure ? "前往 Centrale" : "步行＋M2＋M3｜約 30–35 分"}</span>
      </div>
      <div className={`milan-route-index milan-route-count-${stops.length}`}>
        {stops.map(([id, label, time, number], index) => {
          const flightNode = id === "flight-home";
          return (
            <div className={`milan-route-step milan-route-step-${index + 1}`} key={id}>
              <button type="button" className={`milan-route-node milan-route-node-${index + 1}${flightNode ? " milan-route-flight-node" : ""}`} onClick={() => document.getElementById(`milan-card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                {flightNode
                  ? <img className="milan-route-airplane" src="/italy-monza-2026/route-assets/transfer-airplane.png" alt="" aria-hidden="true" />
                  : <span className="milan-route-cathedral" aria-hidden="true" />}
                <span className="milan-route-node-copy"><span>{number}</span><strong>{label}</strong><small>{time}</small></span>
              </button>
              {index < edges.length && <div className={`milan-route-edge milan-route-edge-${index + 1}`}><i aria-hidden="true" /><span>{edges[index]}</span></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MilanReturnJourney() {
  return (
    <article className="milan-return-journey" aria-label="9 月 8 日回程、轉機與抵達時間">
      <div className="milan-return-journey-heading"><span>RETURN FLIGHT</span><h3>米蘭回家囉</h3><p>兩段飛行與伊斯坦堡轉機一次看完。</p></div>
      <div className="milan-return-flight-flow">
        <div className="milan-return-plane"><img src="/italy-monza-2026/route-assets/transfer-airplane.png" alt="" aria-hidden="true" /><strong>TK1876</strong></div>
        <div className="milan-flight-leg"><span><small>MXP</small><strong>19:45</strong><em>9/8</em></span><i>→</i><span><small>IST</small><strong>23:40</strong><em>9/8</em></span></div>
        <div className="milan-transfer-stamp"><small>TRANSFER</small><strong>1 小時 50 分</strong></div>
        <div className="milan-flight-leg"><span><small>IST</small><strong>01:30</strong><em>9/9</em></span><i>→</i><span><small>TPE</small><strong>17:55</strong><em>9/9 抵達</em></span></div>
        <div className="milan-return-plane second"><img src="/italy-monza-2026/route-assets/transfer-airplane.png" alt="" aria-hidden="true" /><strong>TK24</strong></div>
      </div>
      <dl><div><dt>托運行李</dt><dd>30 kg</dd></div><div><dt>手提行李</dt><dd>1 件・8 kg</dd></div><div><dt>最終抵達</dt><dd>9/9 17:55・台北 TPE</dd></div></dl>
    </article>
  );
}

function MilanCityCard({ id, number, time, title, officialName, mapUrl, status, children }: {
  id: string;
  number: string;
  time: string;
  title: string;
  officialName: string;
  mapUrl?: string;
  status?: string;
  children: React.ReactNode;
}) {
  return (
    <article id={`milan-card-${id}`} className="milan-city-card">
      <div className="milan-card-time"><span>{number}</span><strong>{time}</strong></div>
      <div className="milan-card-body">
        <div className="milan-card-heading"><div><small>MILANO / STOP {number}</small><h3>{title}</h3></div>{status && <span>{status}</span>}</div>
        {mapUrl ? <a className="milan-map-link" href={mapUrl} target="_blank" rel="noreferrer">{officialName}<ArrowIcon /></a> : <p className="milan-official-name">{officialName}</p>}
        <div className="milan-card-content">{children}</div>
      </div>
    </article>
  );
}

function MilanHero({ departure = false, children }: { departure?: boolean; children: React.ReactNode }) {
  return (
    <section className={`milan-route-section${departure ? " milan-departure-theme" : ""}`} aria-label={departure ? "9 月 8 日米蘭離境行程索引" : "9 月 7 日米蘭市區行程索引"}>
      <div className="milan-theme-card">
        <img className="milan-duomo-silhouette" src="/italy-monza-2026/route-assets/milan-duomo-silhouette.png" alt="" aria-hidden="true" />
        <div className="milan-theme-copy" aria-hidden="true"><span>M</span><strong>ILANO</strong></div>
        <div className="milan-card-shell">{children}</div>
      </div>
    </section>
  );
}

function MilanDayPrototype() {
  return (
    <>
      <MilanHero>
        <div className="eyebrow-row milan-eyebrow"><span>DAY 09</span><span className="eyebrow-line" /><span>07 SEP 2026</span></div>
        <div className="milan-theme-note"><span>MILANO CITY DAY</span><strong>DUOMO · BRERA · CASTELLO</strong></div>
        <div className="milan-meta-row"><span>清晨的尖塔到午後的城堡</span><p>大教堂・長廊・屋頂・咖啡・Brera</p></div>
        <MilanRouteIndex stops={milanCityStops} edges={milanCityEdges} morningImage="/italy-monza-2026/route-assets/milan_morning_human.png" morningLabel="米蘭住宿出發" />
      </MilanHero>

      <section className="milan-details-section" aria-labelledby="milan-day-title">
        <div className="milan-details-heading"><span>DETAILS / DAY 09</span><h2 id="milan-day-title">行程細節</h2><p>固定時間先守住，白天主線以步行串起。</p></div>
        <div className="milan-detail-alert"><small>LEAVE AIRBNB</small><strong>05:50 左右出門</strong><span>目標 06:30 抵達 Duomo</span></div>
        <div className="milan-metro-strip"><strong>Airbnb → Duomo</strong><span>步行至 Gioia M2｜5–7 分</span><i>→</i><span>M2 至 Centrale FS｜1 站</span><i>→</i><span>轉 M3 至 Duomo｜約 7–8 分</span><em>全程約 30–35 分</em></div>
        <div className="milan-cards-list">
          <MilanCityCard id="duomo-breakfast" number="01" time="06:30" title="★ 麥當勞早餐看大教堂" officialName="McDonald’s Milano Duomo" mapUrl="https://www.google.com/maps/search/?api=1&query=McDonald%27s+Milano+Duomo" status="優先保留">
            <p>用早餐迎接米蘭清晨；窗邊座位有空再坐，不視為保證。</p><dl><div><dt>抵達目標</dt><dd>06:30</dd></div><div><dt>下一站</dt><dd>步行約 1–2 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="duomo-square" number="02" time="07:15" title="★ 米蘭大教堂" officialName="Duomo di Milano／Piazza del Duomo" mapUrl="https://www.google.com/maps/search/?api=1&query=Duomo+di+Milano+Piazza+del+Duomo" status="必去">
            <p>先拍清晨空景，保留完整立面、廣場與尖塔視角。</p><dl><div><dt>時段</dt><dd>07:15 起</dd></div><div><dt>下一站</dt><dd>步行約 1–2 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="galleria" number="03" time="07:15–08:15" title="★ Galleria 長廊" officialName="Galleria Vittorio Emanuele II" mapUrl="https://www.google.com/maps/search/?api=1&query=Galleria+Vittorio+Emanuele+II+Milano" status="必去">
            <p>趁店家尚未完全熱鬧前看拱頂、地磚與晨光；與大教堂共用 07:15–08:15 時段。</p><dl><div><dt>拍攝重點</dt><dd>拱頂・中央八角廳</dd></div><div><dt>屋頂入口</dt><dd>步行約 3–5 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="duomo-rooftop" number="04" time="09:00" title="★ 爬去屋頂上" officialName="Duomo Rooftop" mapUrl="https://www.google.com/maps/search/?api=1&query=Duomo+Rooftop+Milano" status="待購票">
            <p>搭電梯上屋頂，預留約 60 分鐘；前一日確認天候與官方開放狀態。</p><dl><div><dt>方式</dt><dd>電梯上屋頂</dd></div><div><dt>預留</dt><dd>約 60 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="starbucks-milan" number="05" time="10:10" title="★ 米蘭星巴克" officialName="Starbucks Reserve Roastery Milano" mapUrl="https://www.google.com/maps/search/?api=1&query=Starbucks+Reserve+Roastery+Piazza+Cordusio+1+Milano" status="優先保留">
            <p>Piazza Cordusio 1；從 Duomo Rooftop 步行約 8–10 分鐘。</p><dl><div><dt>重點</dt><dd>米蘭烘焙工坊空間</dd></div><div><dt>前往 Brera</dt><dd>步行約 15–20 分鐘</dd></div></dl>
          </MilanCityCard>
          <LunchNote title="12:30 Brera 午餐" note="Stendhal Milano／Rosso Brera 為候選，現場決定。" />
          <MilanCityCard id="brera" number="06" time="11:00–13:45" title="★ Brera 小店慢逛＋午餐" officialName="Brera／Santa Maria Novella Milano" mapUrl="https://www.google.com/maps/search/?api=1&query=Santa+Maria+Novella+Milano+Brera" status="必去">
            <p>Santa Maria Novella、Via Fiori Chiari 與 Via Brera 一帶小店為主；服飾、香氛與設計小物集中在這段。</p><dl><div><dt>午餐候選</dt><dd>Stendhal Milano／Rosso Brera</dd></div><div><dt>下一站</dt><dd>步行約 12–15 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="castello" number="07" time="14:00–16:15" title="☆ 米蘭城堡＋公園散步" officialName="Castello Sforzesco／Parco Sempione" mapUrl="https://www.google.com/maps/search/?api=1&query=Castello+Sforzesco+Milano" status="第一順位可刪">
            <p>城堡外部與庭院為主，接著走入 Parco Sempione；博物館不是必去。</p><dl><div><dt>公園</dt><dd>城堡步行約 2–5 分鐘</dd></div><div><dt>回住宿</dt><dd>步行至 Cadorna FN 約 10–15 分</dd></div></dl>
          </MilanCityCard>
          <aside className="milan-flex-note"><span>16:30 後</span><strong>Cafezal Solferino optional</strong><p>之後視體力逛 Rinascente 或回住宿；晚餐不綁死。LEC 只在 9/4 未買到時補買。</p></aside>
          <aside className="milan-return-note"><strong>回住宿</strong><p>若走到 Castello／Parco Sempione，步行至 Cadorna FN 約 10–15 分鐘，再搭 M2 往 Gioia；依當日 ATM M2 即時營運調整。</p></aside>
        </div>
      </section>
      <footer className="prototype-footer milan-footer"><span>ITALY · MONZA 2026</span><p>9/7 Milano city day</p></footer>
    </>
  );
}

function MilanDepartureDayPrototype() {
  return (
    <>
      <MilanHero departure>
        <div className="eyebrow-row milan-eyebrow"><span>DAY 10</span><span className="eyebrow-line" /><span>08 SEP 2026</span></div>
        <div className="milan-theme-note"><span>ARRIVEDERCI MILANO</span><strong>CENTRALE · MXP · TAIPEI</strong></div>
        <div className="milan-meta-row"><span>最後半天・不做最後一刻衝刺</span><p>寄行李・早午餐・咖啡豆・返程</p></div>
        <MilanRouteIndex stops={milanDepartureStops} edges={milanDepartureEdges} morningImage="/italy-monza-2026/route-assets/milan_morning_cow_bluegray.png" morningLabel="最後一個米蘭早晨" departure />
      </MilanHero>

      <section className="milan-details-section milan-departure-details" aria-labelledby="milan-departure-title">
        <div className="milan-details-heading"><span>DETAILS / DAY 10</span><h2 id="milan-departure-title">行程細節</h2><p>先寄行李，再把最後一杯咖啡和午餐好好吃完。</p></div>
        <div className="milan-departure-clock"><div><small>CHECK-OUT</small><strong>10:00</strong><span>Airbnb 最晚退房</span></div><i /><div><small>LEAVE MILANO</small><strong>14:55</strong><span>15:25 僅作備案</span></div><i /><div><small>FLIGHT</small><strong>19:45</strong><span>TK1876 · MXP T1</span></div></div>
        <div className="milan-cards-list">
          <MilanCityCard id="centrale-drop" number="01" time="退房後" title="Centrale 寄行李" officialName="Milano Centrale／Ki Point" mapUrl="https://www.google.com/maps/search/?api=1&query=KiPoint+Milano+Centrale" status="待複核">
            <p>退房後先把大行李寄放；Ki Point 為第一候選，出發前複核位置、營業時間與收費。</p><dl><div><dt>下一站</dt><dd>步行約 15–20 分鐘</dd></div><div><dt>原則</dt><dd>寄完再開始最後半天</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="pave" number="02" time="寄放後" title="米蘭早午餐" officialName="Pavé Milano Casati" mapUrl="https://www.google.com/maps/search/?api=1&query=Pave+Milano+Via+Felice+Casati+27" status="主線">
            <p>Via Felice Casati 27；實際抵達依退房與寄放行李進度調整。</p><dl><div><dt>從 Centrale</dt><dd>步行約 15–20 分鐘</dd></div><div><dt>前往咖啡店</dt><dd>步行約 10–15 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="orsonero" number="03" time="上午" title="買咖啡豆" officialName="Orsonero Coffee" mapUrl="https://www.google.com/maps/search/?api=1&query=Orsonero+Coffee+Via+Giuseppe+Broggi+15+Milano" status="候選">
            <p>Via Giuseppe Broggi 15；喝到喜歡再買。若順路可短逛 Porta Venezia／Corso Buenos Aires，12:15 左右停止採買。</p><dl><div><dt>午餐主選</dt><dd>步行約 8–12 分鐘</dd></div><div><dt>午餐備選</dt><dd>步行約 12–15 分鐘</dd></div></dl>
          </MilanCityCard>
          <LunchNote title="12:30 最後午餐" note="Ristorante Da Oscar 為主選；想快速則改 Bella Colombina。" />
          <MilanCityCard id="last-lunch" number="04" time="12:30" title="午餐" officialName="Ristorante Da Oscar／Bella Colombina" mapUrl="https://www.google.com/maps/search/?api=1&query=Ristorante+Da+Oscar+Milano" status="現場決定">
            <p>主選 Ristorante Da Oscar；若想縮短用餐時間，改 Bella Colombina。</p><dl><div><dt>Da Oscar → Centrale</dt><dd>步行約 15–20 分鐘</dd></div><div><dt>Bella Colombina → Centrale</dt><dd>步行約 12–15 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="centrale-pickup" number="05" time="13:45–14:30" title="取行李去機場" officialName="Milano Centrale" mapUrl="https://www.google.com/maps/search/?api=1&query=Milano+Centrale" status="不可延誤">
            <p>取行李、上廁所並確認月台；首選搭 14:55 左右的 Malpensa Express。</p><dl><div><dt>首選</dt><dd>14:55 左右發車</dd></div><div><dt>備案</dt><dd>15:25 左右，不建議再晚</dd></div></dl>
          </MilanCityCard>
          <MilanCityCard id="flight-home" number="06" time="19:45" title="回家囉" officialName="Turkish Airlines TK1876／MXP Terminal 1" mapUrl="https://www.google.com/maps/search/?api=1&query=Malpensa+Airport+Terminal+1" status="已確認">
            <div className="milan-boarding-pass"><span>TK1876</span><div><small>MILANO MXP</small><strong>19:45</strong></div><i>→</i><div><small>ISTANBUL IST</small><strong>23:40</strong></div></div>
            <dl><div><dt>首選抵達 T1</dt><dd>約 15:46</dd></div><div><dt>轉機</dt><dd>1 小時 50 分鐘</dd></div></dl>
          </MilanCityCard>
          <MilanReturnJourney />
        </div>
      </section>
      <footer className="prototype-footer milan-footer departure"><span>ARRIVEDERCI MILANO</span><p>9/8 · MXP 19:45 · TK1876</p></footer>
    </>
  );
}

function OpeningIntro({ mode, runId, onEnter, onReplay }: {
  mode: OpeningMode;
  runId: number;
  onEnter: () => void;
  onReplay: () => void;
}) {
  const welcome = "WELCOME TO THE TEMPLE OF SPEED";

  return (
    <section className={`opening-screen opening-${mode}`} aria-label="Monza 旅程開場">
      <div className="opening-timeline" key={runId} aria-hidden="true">
        <div className="opening-montage">
          {openingFrames.map(([id, src, start, duration, x, y], index) => (
            <img
              key={id}
              className={`opening-frame opening-frame-${id}`}
              src={src}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
              style={{
                "--opening-start": `${start}s`,
                "--opening-duration": `${duration}s`,
                "--opening-x": x,
                "--opening-y": y,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="opening-light-leak opening-light-leak-one" />
        <div className="opening-light-leak opening-light-leak-two" />
        <div className="opening-film-burn" />
        <div className="opening-flicker" />
        <div className="opening-film-dust" />

        <p className="opening-welcome">{welcome}</p>

        <div className="opening-title-card">
          <svg className="opening-track-logo" viewBox="0 0 500 250" role="img" aria-label="Monza 賽道輪廓">
            <path pathLength="1" d="M 65 21 L 42 23 L 23 30 L 16 40 L 16 47 L 21 59 L 23 60 L 26 67 L 28 68 L 35 81 L 41 88 L 51 107 L 60 136 L 71 189 L 80 211 L 90 221 L 98 225 L 114 228 L 202 228 L 204 226 L 220 228 L 251 228 L 251 217 L 253 211 L 255 207 L 261 202 L 263 197 L 265 178 L 239 175 L 219 169 L 206 162 L 204 159 L 202 159 L 179 137 L 173 152 L 173 184 L 179 200 L 181 201 L 183 206 L 194 217 L 202 221 L 204 226 L 220 228 L 251 228 L 408 228 L 424 226 L 432 223 L 431 219 L 439 211 L 445 193 L 443 183 L 440 180 L 433 177 L 347 176 L 265 178 L 347 176 L 433 177 L 440 180 L 443 183 L 445 193 L 439 211 L 431 219 L 432 223 L 435 225 L 446 222 L 462 213 L 474 200 L 480 186 L 482 176 L 481 156 L 478 145 L 473 135 L 458 120 L 443 113 L 431 111 L 214 112 L 196 118 L 195 120 L 190 122 L 183 129 L 179 137 L 177 133 L 175 133 L 149 107 L 140 96 L 108 65 L 87 28 L 84 25 L 75 21 L 65 21 Z" />
          </svg>

          <div className="opening-title-copy">
            <h1>MONZA</h1>
            <div className="opening-country-mark">
              <span>ITALY</span>
              <i aria-label="義大利三色">
                <b />
                <b />
                <b />
              </i>
            </div>
          </div>
        </div>
      </div>

      <div className="opening-title-actions">
        <button type="button" className="opening-enter" onClick={onEnter}>
          <strong>查看行程</strong>
          <small>Enter the journey</small>
        </button>
        <button type="button" className="opening-replay" onClick={onReplay}>REPLAY INTRO</button>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeDate, setActiveDate] = useState("8/30");
  const [openingMode, setOpeningMode] = useState<OpeningMode>("boot");
  const [openingRun, setOpeningRun] = useState(0);
  const activeDay = days.find((day) => day[0] === activeDate) ?? days[1];

  useEffect(() => {
    let cancelled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = window.sessionStorage.getItem("monza-opening-seen") === "1";

    if (alreadySeen || reducedMotion) {
      window.sessionStorage.setItem("monza-opening-seen", "1");
      setOpeningMode("title");
      return;
    }

    Promise.all(openingFrames.map(([, src]) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
    }))).then(() => {
      if (!cancelled) setOpeningMode("playing");
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (openingMode !== "playing") return;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("monza-opening-seen", "1");
      setOpeningMode("title");
    }, 7970);
    return () => window.clearTimeout(timer);
  }, [openingMode, openingRun]);

  useEffect(() => {
    if (openingMode !== "exiting") return;
    const timer = window.setTimeout(() => setOpeningMode("entered"), 760);
    return () => window.clearTimeout(timer);
  }, [openingMode]);

  useEffect(() => {
    if (openingMode === "entered") {
      document.body.style.removeProperty("overflow");
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [openingMode]);

  useEffect(() => {
    if (openingMode !== "entered") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeDate, openingMode]);

  const replayOpening = useCallback(() => {
    setOpeningRun((value) => value + 1);
    setOpeningMode("playing");
  }, []);

  return (
    <>
      {openingMode !== "entered" && (
        <OpeningIntro
          mode={openingMode}
          runId={openingRun}
          onEnter={() => {
            setActiveDate("8/30");
            setOpeningMode("exiting");
          }}
          onReplay={replayOpening}
        />
      )}
      <main className={`${activeDate === "9/6" ? "race-mode-active " : ""}itinerary-shell${openingMode === "entered" ? " itinerary-visible" : ""}`}>
      {activeDate !== "9/6" && <nav className="date-nav" aria-label="選擇日期">
        <div className="date-track">
          {days.map(([date, weekday, label]) => (
            <button key={date} className={activeDate === date ? "date-tab active" : "date-tab"} onClick={() => setActiveDate(date)} aria-current={activeDate === date ? "page" : undefined}>
              <span>{weekday}</span><strong>{date}</strong><small>{label}</small>
            </button>
          ))}
        </div>
      </nav>}

      {activeDate === "8/30" ? (
        <FlightDayPrototype />
      ) : activeDate === "9/1" ? (
        <WineDayPrototype />
      ) : activeDate === "9/2" ? (
        <BaroloDayPrototype />
      ) : activeDate === "9/3" ? (
        <AstiDayPrototype />
      ) : activeDate === "9/4" ? (
        <TravelDayPrototype />
      ) : activeDate === "9/5" ? (
        <PitDayPrototype />
      ) : activeDate === "9/6" ? (
        <RaceDayPrototype onExit={() => setActiveDate("9/5")} />
      ) : activeDate === "9/7" ? (
        <MilanDayPrototype />
      ) : activeDate === "9/8" ? (
        <MilanDepartureDayPrototype />
      ) : activeDay[3] ? (
        <>
          <section className="route-section" aria-label="8 月 31 日 Maranello 行程">
            <div className="route-theme-card">
              <img className="horse-watermark" src="/italy-monza-2026/rearing-horse.png" alt="" aria-hidden="true" />
              <div className="theme-word" aria-hidden="true"><span className="solid-letter">M</span><span className="outline-word">ARANELLO</span></div>
              <div className="route-card-content">
                <div className="eyebrow-row"><span>DAY 02</span><span className="eyebrow-line" /><span>31 AUG 2026</span></div>
                <div className="racing-details" aria-hidden="true"><span>MODENA · EMILIA-ROMAGNA</span><i /><strong>ROUTE 01</strong></div>
                <div className="route-meta-row">
                  <span>FERRARI DAY · ROUTE / 01</span>
                  <p>米蘭機場・Maranello・Neive</p>
                </div>
                <FerrariRouteIndex />
              </div>
            </div>
          </section>

          <section className="details-section" aria-labelledby="details-title">
            <div className="wine-details-heading ferrari-details-heading">
              <span>DETAILS / DAY 2</span>
              <h2 id="details-title">行程細節</h2>
            </div>
            <div className="cards-list">
              <ItineraryCard id="pickup" number="01" time="08:00" displayName="租車上路" officialName="Europcar Malpensa Airport T1" mapUrl="https://www.google.com/maps/search/?api=1&query=Europcar+Milano+Malpensa+Terminal+1" meta={["已確認"]}>
                <dl className="wine-facts ferrari-facts"><div><dt>取車航廈</dt><dd>Terminal 1</dd></div><div><dt>營業時間</dt><dd>07:30–23:30</dd></div></dl>
              </ItineraryCard>

              <ItineraryCard id="museum" number="02" time="抵達後" displayName="法拉利博物館" officialName="Museo Ferrari Maranello" mapUrl="https://www.google.com/maps/search/?api=1&query=Museo+Ferrari+Maranello+Via+Alfredo+Dino+Ferrari+43" meta={["1.5–2 小時"]}>
                <dl className="wine-facts ferrari-facts"><div><dt>開放時間</dt><dd>09:30–19:00</dd></div><div><dt>最後入場</dt><dd>18:15</dd></div><div><dt>館內</dt><dd>Ferrari Museum Store</dd></div></dl>
              </ItineraryCard>

              <ItineraryCard id="gate" number="03" time="午餐前後" displayName="Ferrari 經典大門" officialName="Ferrari Factory Gate" mapUrl="https://www.google.com/maps/search/?api=1&query=Via+Abetone+Inferiore+4+Maranello" meta={["15–30 分鐘"]}>
                <dl className="wine-facts ferrari-facts"><div><dt>地址</dt><dd>Via Abetone Inferiore 4</dd></div></dl>
              </ItineraryCard>

              <LunchNote title="12:30 Ristorante Cavallino" note="Ferrari – La Genesi tasting menu・Sala Principale。" />

              <ItineraryCard id="lunch" number="04" time="12:30" displayName="法拉利餐廳" officialName="Ristorante Cavallino" mapUrl="https://www.google.com/maps/search/?api=1&query=Ristorante+Cavallino+Via+Abetone+Inferiore+1+Maranello" meta={["已訂", "2 位"]}>
                <p className="ferrari-menu"><strong>Ferrari – La Genesi</strong><span>Tasting menu</span></p>
                <dl className="wine-facts ferrari-facts"><div><dt>座位</dt><dd>Sala Principale</dd></div><div><dt>價格</dt><dd>€108／人</dd></div><div><dt>遲到寬限</dt><dd>15 分鐘</dd></div><div><dt>地址</dt><dd>Via Abetone Inferiore 1</dd></div></dl>
              </ItineraryCard>

              <ItineraryCard id="neive" number="05" time="傍晚" displayName="前往紅酒山谷" officialName="Neive 住宿" mapUrl="https://www.google.com/maps/search/?api=1&query=Neive+Piemonte+12052+Italy" meta={["Langhe", "4 晚"]}>
                <dl className="wine-facts ferrari-facts"><div><dt>地址</dt><dd>Neive, Piemonte 12052, Italy</dd></div><div><dt>房東</dt><dd>Chiara</dd></div><div><dt>入住</dt><dd>13:00 後</dd></div><div><dt>住宿</dt><dd>4 晚</dd></div></dl>
              </ItineraryCard>
              <p className="wine-day-rhythm ferrari-day-rhythm"><span>當日節奏</span> 本頁依原定順序顯示；若時間不足，以固定時段優先，其餘停留時間現場調整。</p>
            </div>
          </section>
          <footer className="prototype-footer"><span>ITALY · MONZA 2026</span><p>8/31 Maranello · Neive</p></footer>
        </>
      ) : (
        <section className="day-placeholder">
          <span className="placeholder-date">{activeDay[0]}</span><p>{activeDay[2]}</p><h1>這一天還在等樣板確認</h1>
          <p className="placeholder-copy">目前先用 8/31 Maranello 確認頁面結構、字量與互動；定稿後再套用其他日期。</p>
          <button onClick={() => setActiveDate("8/31")}>回到 8/31 原型</button>
        </section>
      )}
      </main>
    </>
  );
}
