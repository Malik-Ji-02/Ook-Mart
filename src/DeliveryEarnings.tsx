import React, { useState } from 'react';

interface DeliveryEarningsProps {
  riderName: string;
  completedDeliveries: string[];
  deliveryOnline: boolean;
  notify: (msg: string) => void;
  go: (page: string) => void;
}

interface DayEarnings {
  id: string;
  dayName: string;
  dateStr: string;
  isToday: boolean;
  baseTotal: number;
  tripsBase: number;
  hours: string;
  basePay: number;
  surge: number;
  tipsBase: number;
  bonus: number;
  status: string;
  statusType: 'live' | 'settled';
  trips: {
    orderId: string;
    shop: string;
    area: string;
    time: string;
    fare: number;
    tip?: number;
  }[];
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    wallet: (
      <>
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 1-1 1v2a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6" />
        <circle cx="18" cy="14" r="1" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v18h18M8 16v-5m5 5V7m5 9V4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    truck: (
      <>
        <path d="M2 5h12v12H2Zm12 5h4l4 5v2h-8" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronUp: <path d="m18 15-6-6-6 6" />,
    bank: (
      <>
        <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2l10 5H2z" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.wallet}
    </svg>
  );
}

export function DeliveryEarnings({
  riderName,
  completedDeliveries,
  deliveryOnline,
  notify,
  go,
}: DeliveryEarningsProps) {
  const [expandedDayId, setExpandedDayId] = useState<string | null>('day-0');
  const [withdrawing, setWithdrawing] = useState(false);
  const [customWithdrawDone, setCustomWithdrawDone] = useState(false);

  // Dynamic Session Additions
  const extraTrips = completedDeliveries.length;
  const extraMoney = extraTrips * 45;
  const extraTips = extraTrips * 15;

  // 1. Daily Earnings (Today)
  const todayTotal = 1240 + extraMoney;
  const todayTrips = 14 + extraTrips;
  const todayBasePay = 840 + extraTrips * 30;
  const todaySurge = 210;
  const todayTips = 90 + extraTips;
  const todayBonus = 100;
  const todayTarget = 18;
  const todayTargetPct = Math.min(100, Math.round((todayTrips / todayTarget) * 100));

  // 2. Daywise History Data (Past 7 Days)
  const pastDays: DayEarnings[] = [
    {
      id: 'day-0',
      dayName: 'Today',
      dateStr: 'Sun, 02 Nov 2026',
      isToday: true,
      baseTotal: todayTotal,
      tripsBase: todayTrips,
      hours: '5h 45m',
      basePay: todayBasePay,
      surge: todaySurge,
      tipsBase: todayTips,
      bonus: todayBonus,
      status: 'Active Shift (In Progress)',
      statusType: 'live',
      trips: [
        {
          orderId: 'OOK-1048',
          shop: 'Sharma General Store',
          area: 'Model Town, H.No 412',
          time: '12:45 PM',
          fare: 55,
          tip: 15,
        },
        {
          orderId: 'OOK-1049',
          shop: 'Aggarwal Daily Needs',
          area: 'Sector 11 HUDA',
          time: '01:20 PM',
          fare: 48,
          tip: 10,
        },
        {
          orderId: 'OOK-1050',
          shop: 'Sri Balaji Stores',
          area: 'GT Road Near Sanjay Chowk',
          time: '02:05 PM',
          fare: 65,
          tip: 20,
        },
        {
          orderId: 'OOK-1051',
          shop: 'Gupta Supermarket',
          area: 'Ansals Sushant City',
          time: '03:15 PM',
          fare: 72,
          tip: 25,
        },
      ],
    },
    {
      id: 'day-1',
      dayName: 'Yesterday',
      dateStr: 'Sat, 01 Nov 2026',
      isToday: false,
      baseTotal: 1620,
      tripsBase: 22,
      hours: '8h 15m',
      basePay: 1180,
      surge: 260,
      tipsBase: 180,
      bonus: 0,
      status: 'Settled · UPI Credited',
      statusType: 'settled',
      trips: [
        {
          orderId: 'OOK-1031',
          shop: 'Sharma General Store',
          area: 'Model Town Block C',
          time: '08:40 PM',
          fare: 60,
          tip: 20,
        },
        {
          orderId: 'OOK-1028',
          shop: 'Sri Balaji Stores',
          area: 'Sector 12 Urban Estate',
          time: '07:15 PM',
          fare: 55,
          tip: 15,
        },
        {
          orderId: 'OOK-1025',
          shop: 'Aggarwal Daily Needs',
          area: 'Insar Bazar Chowk',
          time: '05:50 PM',
          fare: 45,
          tip: 10,
        },
      ],
    },
    {
      id: 'day-2',
      dayName: 'Friday',
      dateStr: '31 Oct 2026',
      isToday: false,
      baseTotal: 1480,
      tripsBase: 20,
      hours: '7h 30m',
      basePay: 1080,
      surge: 240,
      tipsBase: 160,
      bonus: 0,
      status: 'Settled · UPI Credited',
      statusType: 'settled',
      trips: [
        {
          orderId: 'OOK-1014',
          shop: 'Gupta Supermarket',
          area: 'Model Town Link Road',
          time: '09:10 PM',
          fare: 68,
          tip: 25,
        },
        {
          orderId: 'OOK-1009',
          shop: 'Sharma General Store',
          area: 'Sector 11 Park View',
          time: '06:30 PM',
          fare: 52,
          tip: 15,
        },
      ],
    },
    {
      id: 'day-3',
      dayName: 'Thursday',
      dateStr: '30 Oct 2026',
      isToday: false,
      baseTotal: 1050,
      tripsBase: 14,
      hours: '5h 50m',
      basePay: 810,
      surge: 160,
      tipsBase: 80,
      bonus: 0,
      status: 'Settled · UPI Credited',
      statusType: 'settled',
      trips: [
        {
          orderId: 'OOK-0992',
          shop: 'Aggarwal Daily Needs',
          area: 'Model Town Market',
          time: '04:15 PM',
          fare: 45,
          tip: 10,
        },
      ],
    },
    {
      id: 'day-4',
      dayName: 'Wednesday',
      dateStr: '29 Oct 2026',
      isToday: false,
      baseTotal: 1340,
      tripsBase: 18,
      hours: '6h 45m',
      basePay: 980,
      surge: 230,
      tipsBase: 130,
      bonus: 0,
      status: 'Settled · UPI Credited',
      statusType: 'settled',
      trips: [
        {
          orderId: 'OOK-0975',
          shop: 'Sri Balaji Stores',
          area: 'Sector 11 Main Gate',
          time: '07:20 PM',
          fare: 54,
          tip: 15,
        },
      ],
    },
    {
      id: 'day-5',
      dayName: 'Tuesday',
      dateStr: '28 Oct 2026',
      isToday: false,
      baseTotal: 980,
      tripsBase: 13,
      hours: '5h 10m',
      basePay: 750,
      surge: 150,
      tipsBase: 80,
      bonus: 0,
      status: 'Settled · UPI Credited',
      statusType: 'settled',
      trips: [
        {
          orderId: 'OOK-0958',
          shop: 'Sharma General Store',
          area: 'Railway Road Panipat',
          time: '02:40 PM',
          fare: 48,
          tip: 10,
        },
      ],
    },
    {
      id: 'day-6',
      dayName: 'Monday',
      dateStr: '27 Oct 2026',
      isToday: false,
      baseTotal: 1120,
      tripsBase: 15,
      hours: '6h 05m',
      basePay: 860,
      surge: 180,
      tipsBase: 80,
      bonus: 0,
      status: 'Settled · UPI Credited',
      statusType: 'settled',
      trips: [
        {
          orderId: 'OOK-0941',
          shop: 'Gupta Supermarket',
          area: 'Model Town Sector 11',
          time: '06:50 PM',
          fare: 58,
          tip: 12,
        },
      ],
    },
  ];

  // 3. Monthly Calculations (At the Bottom)
  const monthBaseTotal = 34850;
  const monthTotal = monthBaseTotal + extraMoney;
  const monthTrips = 438 + extraTrips;
  const monthHours = '186.4 hrs';
  const monthTips = 2640 + extraTips;
  const monthSurgeAndBonus = 5820;
  const monthAlreadySettled = 30300;
  const availableToWithdraw = customWithdrawDone ? 0 : 4550 + extraMoney;

  function handleInstantWithdraw() {
    if (availableToWithdraw <= 0) {
      notify('All available earnings have already been transferred to your linked bank account.');
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setCustomWithdrawDone(true);
      notify(
        `🎉 Instant Payout of ₹${availableToWithdraw.toLocaleString('en-IN')} sent to ${riderName}'s linked HDFC Bank A/c (•••• 4092) via IMPS!`
      );
    }, 900);
  }

  function handleDownloadStatement() {
    notify('📄 Preparing October–November 2026 Earnings & TDS Statement PDF...');
    setTimeout(() => {
      notify('✅ Statement downloaded: OokMart_Partner_Earnings_OctNov2026.pdf');
    }, 1200);
  }

  // Max daily earnings for relative bar chart heights
  const maxDayVal = Math.max(...pastDays.map((d) => d.baseTotal));

  return (
    <div className="delivery-earnings-page">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: DAILY EARNINGS AT THE TOP                          */}
      {/* ------------------------------------------------------------- */}
      <section className="earnings-top-section">
        {/* Top Header Card */}
        <div className="earnings-hero-card">
          <div className="eh-kicker-row">
            <span className="eh-badge">
              <Icon name="wallet" size={14} /> LIVE FLEET WALLET
            </span>
            <span className={`eh-online-pill ${deliveryOnline ? 'online' : 'offline'}`}>
              <span className="eh-dot" />
              {deliveryOnline ? 'Duty Online' : 'Duty Offline'}
            </span>
          </div>

          <div className="eh-amount-block">
            <span className="eh-label">TODAY'S TOTAL EARNINGS</span>
            <div className="eh-value-wrap">
              <span className="eh-currency">₹</span>
              <h1 className="eh-amount">{todayTotal.toLocaleString('en-IN')}</h1>
            </div>
            <p className="eh-subtext">
              Updated live from Panipat dispatch · {todayTrips} trips completed today
            </p>
          </div>

          {/* Quick Metrics Bar for Today */}
          <div className="eh-metrics-grid">
            <div className="eh-metric-tile">
              <div className="eh-tile-icon">
                <Icon name="truck" size={15} />
              </div>
              <div className="eh-tile-content">
                <strong>{todayTrips}</strong>
                <small>Completed Trips</small>
              </div>
            </div>
            <div className="eh-metric-tile">
              <div className="eh-tile-icon">
                <Icon name="clock" size={15} />
              </div>
              <div className="eh-tile-content">
                <strong>5h 45m</strong>
                <small>Online Hours</small>
              </div>
            </div>
            <div className="eh-metric-tile">
              <div className="eh-tile-icon">
                <Icon name="spark" size={15} />
              </div>
              <div className="eh-tile-content">
                <strong>₹{todayTips}</strong>
                <small>Direct Tips (100%)</small>
              </div>
            </div>
          </div>

          {/* Today's Earning Component Breakdown */}
          <div className="eh-breakdown-card">
            <div className="eh-breakdown-head">
              <span>Today's Earning Components</span>
              <span className="eh-breakdown-total">₹{todayTotal}</span>
            </div>
            <div className="eh-breakdown-rows">
              <div className="eh-breakdown-row">
                <span>Base Delivery Fare ({todayTrips} orders)</span>
                <strong>₹{todayBasePay}</strong>
              </div>
              <div className="eh-breakdown-row">
                <span>Distance Surge & Fuel Allowance</span>
                <strong>₹{todaySurge}</strong>
              </div>
              <div className="eh-breakdown-row">
                <span>Customer Doorstep Tips (100% to you)</span>
                <strong className="text-green">₹{todayTips}</strong>
              </div>
              <div className="eh-breakdown-row">
                <span>Lunch Peak Multiplier Bonus</span>
                <strong className="text-green">₹{todayBonus}</strong>
              </div>
            </div>
          </div>

          {/* Daily Incentive Target Progress */}
          <div className="eh-target-box">
            <div className="eh-target-head">
              <div>
                <strong>Daily Target: 18 Deliveries</strong>
                <small>Unlock ₹200 evening peak incentive</small>
              </div>
              <span className="eh-target-pct">{todayTargetPct}%</span>
            </div>
            <div className="eh-progress-track">
              <div className="eh-progress-fill" style={{ width: `${todayTargetPct}%` }} />
            </div>
            <div className="eh-target-footer">
              <small>
                {todayTrips >= todayTarget
                  ? '🎉 Daily target achieved! ₹200 bonus credited.'
                  : `Just ${todayTarget - todayTrips} more delivery to unlock ₹200 bonus!`}
              </small>
            </div>
          </div>

          {/* Today Payout Action */}
          <div className="eh-actions-bar">
            <button
              type="button"
              className="eh-withdraw-btn"
              disabled={withdrawing || availableToWithdraw <= 0}
              onClick={handleInstantWithdraw}
            >
              <Icon name="bank" size={16} />
              <span>
                {withdrawing
                  ? 'Processing Transfer...'
                  : availableToWithdraw > 0
                  ? `Instant Withdraw ₹${availableToWithdraw.toLocaleString('en-IN')}`
                  : 'All Earnings Settled'}
              </span>
            </button>
            <button
              type="button"
              className="eh-route-btn"
              onClick={() => go('Route')}
            >
              <Icon name="truck" size={16} />
              <span>Live Route Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: DAYWISE EARNINGS HISTORY                           */}
      {/* ------------------------------------------------------------- */}
      <section className="earnings-daywise-section">
        <div className="section-title-wrap">
          <div>
            <span className="eyebrow">DAY BY DAY BREAKDOWN</span>
            <h2 className="section-heading-h2">Daywise Earnings History</h2>
            <p className="section-subtext">Past 7 days delivery payout logs and shift hours</p>
          </div>
          <span className="week-range-pill">Past 7 Days</span>
        </div>

        {/* Visual Weekly Bar Chart */}
        <div className="daywise-chart-card">
          <div className="chart-card-title">
            <span>Weekly Earnings Visualizer</span>
            <small>Tap a bar to inspect day</small>
          </div>
          <div className="bars-container">
            {pastDays
              .slice()
              .reverse()
              .map((d) => {
                const heightPct = Math.round((d.baseTotal / maxDayVal) * 100);
                const isSelected = expandedDayId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`bar-column-btn ${isSelected ? 'selected' : ''} ${
                      d.isToday ? 'is-today' : ''
                    }`}
                    onClick={() => setExpandedDayId(d.id)}
                  >
                    <span className="bar-amt-tag">₹{d.baseTotal}</span>
                    <div className="bar-tube-wrap">
                      <div
                        className="bar-tube-fill"
                        style={{ height: `${Math.max(18, heightPct)}%` }}
                      />
                    </div>
                    <span className="bar-day-label">
                      {d.isToday ? 'Today' : d.dayName.slice(0, 3)}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Detailed Daywise Cards List */}
        <div className="daywise-cards-list">
          {pastDays.map((day) => {
            const isExpanded = expandedDayId === day.id;
            return (
              <article
                key={day.id}
                className={`daywise-card ${day.isToday ? 'is-today-card' : ''} ${
                  isExpanded ? 'is-expanded' : ''
                }`}
              >
                <div
                  className="dw-card-header"
                  onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="dw-date-col">
                    <div className="dw-day-name">
                      <strong>{day.dayName}</strong>
                      {day.isToday && <span className="dw-today-badge">Active</span>}
                    </div>
                    <span className="dw-date-str">{day.dateStr}</span>
                  </div>

                  <div className="dw-amount-col">
                    <strong className="dw-total-amt">
                      ₹{day.baseTotal.toLocaleString('en-IN')}
                    </strong>
                    <span className="dw-trips-sub">
                      {day.tripsBase} trips · {day.hours}
                    </span>
                  </div>

                  <span className="dw-expand-toggle">
                    <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={16} />
                  </span>
                </div>

                {/* Day Tags */}
                <div className="dw-tags-row">
                  <span className="dw-chip">Base ₹{day.basePay}</span>
                  <span className="dw-chip">Surge ₹{day.surge}</span>
                  <span className="dw-chip tips">Tips ₹{day.tipsBase}</span>
                  {day.bonus > 0 && <span className="dw-chip bonus">+₹{day.bonus} Bonus</span>}
                  <span className={`dw-status-pill ${day.statusType}`}>
                    <Icon name={day.statusType === 'settled' ? 'check' : 'clock'} size={12} />
                    {day.status}
                  </span>
                </div>

                {/* Expandable Trips Breakdown */}
                {isExpanded && (
                  <div className="dw-trips-drawer">
                    <div className="dw-trips-head">
                      <span>Recent Orders Completed on this Shift:</span>
                      <small>{day.trips.length} sampled</small>
                    </div>
                    <div className="dw-trips-list">
                      {day.trips.map((trip) => (
                        <div key={trip.orderId} className="dw-trip-row">
                          <div className="dw-trip-left">
                            <span className="dw-trip-id">#{trip.orderId}</span>
                            <div>
                              <strong>{trip.shop}</strong>
                              <small>➔ {trip.area}</small>
                            </div>
                          </div>
                          <div className="dw-trip-right">
                            <strong className="dw-trip-fare">₹{trip.fare}</strong>
                            {trip.tip ? (
                              <small className="dw-trip-tip">+₹{trip.tip} tip</small>
                            ) : null}
                            <span className="dw-trip-time">{trip.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: TOTAL EARNINGS OF THE MONTH AT THE BOTTOM          */}
      {/* ------------------------------------------------------------- */}
      <section className="earnings-monthly-section">
        <div className="section-title-wrap">
          <div>
            <span className="eyebrow">MONTHLY REVENUE & SETTLEMENT</span>
            <h2 className="section-heading-h2">Total Monthly Earnings</h2>
            <p className="section-subtext">Cumulative payout for October & November 2026</p>
          </div>
          <span className="month-badge">Month Total</span>
        </div>

        {/* Grand Monthly Overview Hero Card */}
        <div className="monthly-grand-card">
          <div className="mg-top-row">
            <span className="mg-kicker">MONTHLY ACCUMULATED EARNINGS</span>
            <span className="mg-tier-badge">
              <Icon name="spark" size={13} /> Platinum Fleet Rider (Top 5%)
            </span>
          </div>

          <div className="mg-amount-wrap">
            <span className="mg-symbol">₹</span>
            <span className="mg-amount">{monthTotal.toLocaleString('en-IN')}</span>
          </div>
          <p className="mg-sub">
            Total verified earnings from {monthTrips} completed deliveries across Panipat
          </p>

          {/* 4-Stat Monthly Grid */}
          <div className="mg-stats-grid">
            <div className="mg-stat-tile">
              <span className="mg-tile-lbl">Total Trips</span>
              <strong className="mg-tile-val">{monthTrips}</strong>
              <small className="mg-tile-sub">100% successful drops</small>
            </div>
            <div className="mg-stat-tile">
              <span className="mg-tile-lbl">Duty Logged</span>
              <strong className="mg-tile-val">{monthHours}</strong>
              <small className="mg-tile-sub">Avg 6.2 hrs/day</small>
            </div>
            <div className="mg-stat-tile">
              <span className="mg-tile-lbl">Customer Tips</span>
              <strong className="mg-tile-val text-green">
                ₹{monthTips.toLocaleString('en-IN')}
              </strong>
              <small className="mg-tile-sub">Zero platform cut</small>
            </div>
            <div className="mg-stat-tile">
              <span className="mg-tile-lbl">Surge & Bonus</span>
              <strong className="mg-tile-val text-blue">
                ₹{monthSurgeAndBonus.toLocaleString('en-IN')}
              </strong>
              <small className="mg-tile-sub">Weekly milestones</small>
            </div>
          </div>

          {/* Monthly Bank Settlement Details */}
          <div className="mg-settlement-card">
            <div className="mg-settlement-head">
              <div className="mg-bank-info">
                <div className="mg-bank-icon">
                  <Icon name="bank" size={20} />
                </div>
                <div>
                  <strong>HDFC Bank A/C •••• 4092</strong>
                  <small>IFSC: HDFC0001248 · Model Town Branch, Panipat</small>
                </div>
              </div>
              <span className="mg-verified-tag">
                <Icon name="check" size={12} /> Verified UPI
              </span>
            </div>

            <div className="mg-payout-lines">
              <div className="mg-payout-row">
                <span>Total Month Gross Earnings</span>
                <strong>₹{monthTotal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="mg-payout-row">
                <span>Already Transferred to Bank Account</span>
                <strong className="text-green">
                  ₹{monthAlreadySettled.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="mg-payout-row">
                <span>TDS Deducted (Sec 194C @ 1%)</span>
                <span>₹{(monthTotal * 0.01).toFixed(2)}</span>
              </div>
              <div className="mg-payout-row highlight">
                <span>Current Unsettled / Available Balance</span>
                <strong className="text-highlight">
                  ₹{availableToWithdraw.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div className="mg-cycle-note">
              <Icon name="info" size={15} />
              <span>
                Standard auto-settlement cycle executes every Monday at 08:00 AM IST. You can also
                request instant withdrawals anytime.
              </span>
            </div>
          </div>

          {/* Monthly Actions */}
          <div className="mg-bottom-actions">
            <button
              type="button"
              className="mg-action-btn primary"
              disabled={withdrawing || availableToWithdraw <= 0}
              onClick={handleInstantWithdraw}
            >
              <Icon name="bank" size={16} />
              <span>
                {availableToWithdraw > 0
                  ? `Withdraw Balance (₹${availableToWithdraw.toLocaleString('en-IN')})`
                  : 'Balance Transferred'}
              </span>
            </button>

            <button
              type="button"
              className="mg-action-btn outline"
              onClick={handleDownloadStatement}
            >
              <Icon name="download" size={16} />
              <span>Download Monthly Statement (PDF)</span>
            </button>
          </div>
        </div>

        {/* Back to Dispatch orders link */}
        <div className="earnings-footer-nav">
          <button
            type="button"
            className="ef-nav-btn"
            onClick={() => go('Discover')}
          >
            <Icon name="truck" size={16} />
            <span>Go to Active Dispatch Orders</span>
          </button>
          <button
            type="button"
            className="ef-nav-btn"
            onClick={() => go('Account')}
          >
            <Icon name="wallet" size={16} />
            <span>View Partner Profile & KYC</span>
          </button>
        </div>
      </section>
    </div>
  );
}
export default DeliveryEarnings;
