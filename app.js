const STORAGE_KEY = "my-little-sunshine-v1";
const REMINDER_KEY = "my-little-sunshine-reminders-v1";
const BIRTHDAY_KEY = "my-little-sunshine-birthdays-v1";
const WEATHER_KEY = "my-little-sunshine-weather-v1";
const WORKOUT_KEY = "my-little-sunshine-workouts-v1";
const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const reminderSettings = JSON.parse(localStorage.getItem(REMINDER_KEY) || "{}");
const birthdayMemos = JSON.parse(localStorage.getItem(BIRTHDAY_KEY) || "{}");
let customWorkouts = JSON.parse(localStorage.getItem(WORKOUT_KEY) || "[]");
let weatherSettings = JSON.parse(localStorage.getItem(WEATHER_KEY) || "null") || {
  city: "上海",
  latitude: 31.2304,
  longitude: 121.4737,
  timezone: "Asia/Shanghai"
};

const CHINA_WEATHER_CODES = {
  北京: "101010100",
  上海: "101020100",
  天津: "101030100",
  重庆: "101040100",
  广州: "101280101",
  深圳: "101280601",
  杭州: "101210101",
  南京: "101190101",
  成都: "101270101",
  武汉: "101200101",
  西安: "101110101",
  苏州: "101190401",
  长沙: "101250101",
  青岛: "101120201",
  厦门: "101230201",
  昆明: "101290101",
  哈尔滨: "101050101",
  沈阳: "101070101",
  济南: "101120101",
  郑州: "101180101"
};

const HOLIDAY_SCHEDULE_2026 = {
  "2026-01-01": ["元旦", true],
  "2026-01-02": ["元旦", true],
  "2026-01-03": ["元旦", true],
  "2026-01-04": ["元旦", false],
  "2026-02-14": ["春节", false],
  "2026-02-15": ["春节", true],
  "2026-02-16": ["春节", true],
  "2026-02-17": ["春节", true],
  "2026-02-18": ["春节", true],
  "2026-02-19": ["春节", true],
  "2026-02-20": ["春节", true],
  "2026-02-21": ["春节", true],
  "2026-02-22": ["春节", true],
  "2026-02-23": ["春节", true],
  "2026-02-28": ["春节", false],
  "2026-04-04": ["清明节", true],
  "2026-04-05": ["清明节", true],
  "2026-04-06": ["清明节", true],
  "2026-05-01": ["劳动节", true],
  "2026-05-02": ["劳动节", true],
  "2026-05-03": ["劳动节", true],
  "2026-05-04": ["劳动节", true],
  "2026-05-05": ["劳动节", true],
  "2026-05-09": ["劳动节", false],
  "2026-06-19": ["端午节", true],
  "2026-06-20": ["端午节", true],
  "2026-06-21": ["端午节", true],
  "2026-09-20": ["国庆节", false],
  "2026-09-25": ["中秋节", true],
  "2026-09-26": ["中秋节", true],
  "2026-09-27": ["中秋节", true],
  "2026-10-01": ["国庆节", true],
  "2026-10-02": ["国庆节", true],
  "2026-10-03": ["国庆节", true],
  "2026-10-04": ["国庆节", true],
  "2026-10-05": ["国庆节", true],
  "2026-10-06": ["国庆节", true],
  "2026-10-07": ["国庆节", true],
  "2026-10-10": ["国庆节", false]
};

const WORKOUT_LIBRARY = [
  {
    tag: "徒手基础", name: "下肢与推力基础", duration: "25–35分钟",
    exercises: [["椅子深蹲", "2–3组 × 8–12次"], ["墙壁俯卧撑", "2–3组 × 8–12次"], ["臀桥", "2–3组 × 10–15次"], ["提踵", "2组 × 12–15次"]],
    note: "保持自然呼吸，动作稳定后再增加次数。"
  },
  {
    tag: "哑铃训练", name: "哑铃全身基础", duration: "30–40分钟",
    exercises: [["高脚杯深蹲", "3组 × 8–12次"], ["罗马尼亚硬拉", "3组 × 8–12次"], ["单臂划船", "每侧3组 × 10次"], ["地板卧推", "3组 × 8–12次"]],
    note: "选择仍能保留几次余力的重量，不必练到力竭。"
  },
  {
    tag: "弹力带训练", name: "弹力带全身循环", duration: "25–35分钟",
    exercises: [["弹力带深蹲", "3组 × 12次"], ["弹力带划船", "3组 × 12次"], ["弹力带胸推", "3组 × 10次"], ["侧向走", "每侧2组 × 10步"]],
    note: "训练前检查带体和固定点，回程保持控制。"
  },
  {
    tag: "核心稳定", name: "核心与平衡训练", duration: "20–30分钟",
    exercises: [["鸟狗式", "每侧3组 × 8次"], ["死虫式", "每侧3组 × 8次"], ["侧桥支撑", "每侧2组 × 15–30秒"], ["农夫行走", "3轮 × 30–45秒"]],
    note: "以躯干稳定为先，出现腰部不适时缩小动作范围。"
  },
  {
    tag: "上肢力量", name: "推拉力量组合", duration: "25–35分钟",
    exercises: [["坐姿哑铃推举", "3组 × 8–10次"], ["弹力带划船", "3组 × 12次"], ["斜板俯卧撑", "3组 × 8–12次"], ["哑铃弯举", "2组 × 10–12次"]],
    note: "肩膀保持放松，避免憋气和耸肩。"
  },
  {
    tag: "低冲击", name: "餐后轻力量循环", duration: "15–25分钟",
    exercises: [["原地踏步", "2分钟"], ["坐站练习", "3组 × 10次"], ["墙壁俯卧撑", "3组 × 10次"], ["弹力带拉开", "3组 × 12次"]],
    note: "餐后根据身体状态安排，强度以能正常说话为宜。"
  },
  {
    tag: "下肢力量", name: "髋膝稳定训练", duration: "25–35分钟",
    exercises: [["低台阶踏步", "每侧3组 × 8次"], ["分腿蹲辅助", "每侧2组 × 8次"], ["臀桥", "3组 × 12次"], ["弹力带侧向走", "每侧2组 × 10步"]],
    note: "扶稳支撑物，膝盖保持朝向脚尖。"
  },
  {
    tag: "哑铃训练", name: "哑铃上肢与携重", duration: "25–35分钟",
    exercises: [["单臂划船", "每侧3组 × 10次"], ["地板卧推", "3组 × 10次"], ["坐姿推举", "2组 × 8次"], ["农夫行走", "3轮 × 40秒"]],
    note: "携重行走时保持躯干直立、步幅自然。"
  }
];

const TRAINING_BLOCK_LIBRARY = {
  warmup: [
    { label: "01 · 动态热身", title: "全身关节准备", duration: "6–8分钟", items: [["原地踏步", "2分钟"], ["肩绕环", "前后各10次"], ["徒手髋铰链", "10次"], ["椅子深蹲", "8次"]], note: "体温微升、关节活动顺畅后再进入主训练。" },
    { label: "01 · 动态热身", title: "哑铃训练准备", duration: "6–8分钟", items: [["轻松走动", "2分钟"], ["猫牛式", "8次"], ["无负重划船轨迹", "10次"], ["徒手深蹲停顿", "8次"]], note: "第一组主动作使用较轻重量，作为专项热身组。" },
    { label: "01 · 动态热身", title: "弹力带激活", duration: "6–8分钟", items: [["原地踏步摆臂", "2分钟"], ["弹力带拉开", "10次"], ["弹力带侧向走", "每侧8步"], ["臀桥", "10次"]], note: "训练前检查弹力带是否老化、破损，固定点是否牢靠。" }
  ],
  accessory: [
    { label: "03 · 核心辅助", title: "抗伸展与稳定", duration: "8–12分钟", items: [["死虫式", "每侧2组 × 6–8次"], ["鸟狗式", "每侧2组 × 6–8次"], ["农夫行走", "3轮 × 30秒"]], note: "全程保持自然呼吸；腰部不适时减小动作幅度。" },
    { label: "03 · 核心辅助", title: "髋部与平衡", duration: "8–12分钟", items: [["臀桥", "2组 × 10–12次"], ["弹力带侧向走", "每侧2组 × 8步"], ["扶椅单脚站", "每侧2轮 × 20秒"]], note: "平衡动作靠近稳固支撑物完成，不追求摇晃中的勉强坚持。" },
    { label: "03 · 核心辅助", title: "肩胛与携重", duration: "8–12分钟", items: [["弹力带面拉", "2组 × 12次"], ["墙面滑手", "2组 × 8次"], ["单侧提重站立", "每侧3轮 × 20秒"]], note: "肩膀远离耳朵，保持躯干直立，不向负重侧倾斜。" }
  ],
  cooldown: [
    { label: "04 · 放松恢复", title: "全身缓和", duration: "5–8分钟", items: [["慢走", "2分钟"], ["胸肩拉伸", "每侧20–30秒"], ["臀部拉伸", "每侧20–30秒"], ["小腿拉伸", "每侧20–30秒"]], note: "拉伸保持温和，不弹震；呼吸恢复平稳后结束。" },
    { label: "04 · 放松恢复", title: "下肢舒缓", duration: "5–8分钟", items: [["缓慢踏步", "2分钟"], ["髋屈肌拉伸", "每侧20–30秒"], ["大腿后侧拉伸", "每侧20–30秒"], ["踝泵", "每侧10次"]], note: "避免憋气或强压关节，拉伸不应引起锐痛。" },
    { label: "04 · 放松恢复", title: "上肢舒缓", duration: "5–8分钟", items: [["缓慢走动配合呼吸", "2分钟"], ["门框胸肌拉伸", "每侧20秒"], ["背阔肌伸展", "每侧20秒"], ["颈肩轻柔活动", "5次"]], note: "结束后记录身体感受，并按个人计划观察训练后血糖。" }
  ]
};

const today = new Date();
let visibleDate = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let selectedMood = "";
let selectedPlan = "";
let selectedPlanPriority = "normal";
let pendingMedia = [];
let pendingHealth = { glucose: [], meals: [], exercise: [], water: [] };
let editingHealth = null;
let trendRange = 14;
let lastReminderKey = "";
let timelineDate = new Date(selectedDate);
let selectedTimelineEvent = 0;
let timelineEvents = [];

const monthTitle = document.querySelector("#monthTitle");
const calendarGrid = document.querySelector("#calendarGrid");
const weatherCard = document.querySelector("#weatherCard");
const weatherIcon = document.querySelector("#weatherIcon");
const weatherCity = document.querySelector("#weatherCity");
const weatherSummary = document.querySelector("#weatherSummary");
const weatherForecast = document.querySelector("#weatherForecast");
const weatherMetrics = document.querySelector("#weatherMetrics");
const weatherLifeIndices = document.querySelector("#weatherLifeIndices");
const weatherRefresh = document.querySelector("#refreshWeather");
const chinaWeatherLink = document.querySelector("#chinaWeatherLink");
const weatherSettingsModal = document.querySelector("#weatherSettingsModal");
const weatherCityInput = document.querySelector("#weatherCityInput");
const weatherSettingsStatus = document.querySelector("#weatherSettingsStatus");
const selectedWeekday = document.querySelector("#selectedWeekday");
const selectedDateTitle = document.querySelector("#selectedDate");
const calendarInfo = document.querySelector("#calendarInfo");
const thoughtInput = document.querySelector("#thought");
const proudInput = document.querySelector("#proud");
const memoryInput = document.querySelector("#memory");
const mediaInput = document.querySelector("#mediaInput");
const mediaPreview = document.querySelector("#mediaPreview");
const saveStatus = document.querySelector("#saveStatus");
const entryPanel = document.querySelector(".entry-panel");
const calendarPanel = document.querySelector(".calendar-panel");
const recordModal = document.querySelector("#recordModal");
const recordWeekday = document.querySelector("#recordWeekday");
const recordDate = document.querySelector("#recordDate");
const recordMood = document.querySelector("#recordMood");
const recordBody = document.querySelector("#recordBody");
const clearModal = document.querySelector("#clearModal");
const organizerDate = document.querySelector("#organizerDate");
const dayPlanInput = document.querySelector("#dayPlan");
const dayPlanPriority = document.querySelector("#dayPlanPriority");
const birthdayName = document.querySelector("#birthdayName");
const birthdayNote = document.querySelector("#birthdayNote");
const lightbox = document.querySelector("#lightbox");
const lightboxContent = document.querySelector("#lightboxContent");
const todayHealthList = document.querySelector("#todayHealthList");
const glucoseChart = document.querySelector("#glucoseChart");
const chartEmpty = document.querySelector("#chartEmpty");
const chartDateLegend = document.querySelector("#chartDateLegend");
const trendSummary = document.querySelector("#trendSummary");
const healthTimeline = document.querySelector("#healthTimeline");
const timelineDateSummary = document.querySelector("#timelineDateSummary");
const reminderStatus = document.querySelector("#reminderStatus");
const patternSummary = document.querySelector("#patternSummary");
const mealPatterns = document.querySelector("#mealPatterns");
const exercisePatterns = document.querySelector("#exercisePatterns");
const sectionNav = document.querySelector(".section-nav");
const sectionNavItems = [...document.querySelectorAll(".section-nav-item")];
const entryModeButtons = [...document.querySelectorAll(".entry-mode-button")];
const workoutPlans = document.querySelector("#workoutPlans");
const trainingBlocks = document.querySelector("#trainingBlocks");
const mainWorkoutPicker = document.querySelector("#mainWorkoutPicker");
const customWorkoutForm = document.querySelector("#customWorkoutForm");
const scrollProgressBar = document.querySelector("#scrollProgressBar");
const iosInstallTip = document.querySelector("#iosInstallTip");
const dismissInstallTip = document.querySelector("#dismissInstallTip");
let visibleWorkouts = [];
let selectedWorkout = WORKOUT_LIBRARY[1];
const activeTrainingBlocks = {};
const SESSION_BLOCK_ORDER = ["warmup", "main", "accessory", "cooldown"];

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

function recurringDateKey(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function lunarInfo(date) {
  const formatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const values = Object.fromEntries(
    formatter.formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const day = Number(values.day);
  const dayNames = [
    "", "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
  ];
  const zodiacByBranch = {
    子: "鼠", 丑: "牛", 寅: "虎", 卯: "兔", 辰: "龙", 巳: "蛇",
    午: "马", 未: "羊", 申: "猴", 酉: "鸡", 戌: "狗", 亥: "猪"
  };
  const yearName = values.yearName || "";
  return {
    yearName,
    zodiac: zodiacByBranch[yearName.slice(-1)] || "",
    month: values.month || "",
    day,
    dayName: dayNames[day] || String(day),
    short: day === 1 ? values.month : dayNames[day],
    full: `${yearName}年 ${values.month}${dayNames[day] || day}`
  };
}

function traditionalFestival(date, lunar = lunarInfo(date)) {
  const lunarFestivals = {
    "正月-1": "春节",
    "正月-15": "元宵节",
    "二月-2": "龙抬头",
    "五月-5": "端午节",
    "七月-7": "七夕",
    "八月-15": "中秋节",
    "九月-9": "重阳节",
    "腊月-8": "腊八节"
  };
  const lunarName = lunarFestivals[`${lunar.month}-${lunar.day}`];
  if (lunarName) return lunarName;
  const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const tomorrowLunar = lunarInfo(tomorrow);
  if (tomorrowLunar.month === "正月" && tomorrowLunar.day === 1) return "除夕";
  return "";
}

function statutoryHoliday(date, lunar = lunarInfo(date)) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 1 && day === 1) return "元旦";
  if (traditionalFestival(date, lunar) === "除夕") return "除夕";
  if (lunar.month === "正月" && [1, 2, 3].includes(lunar.day)) return "春节";
  if (date.getFullYear() === 2026 && month === 4 && day === 5) return "清明节";
  if (month === 5 && [1, 2].includes(day)) return "劳动节";
  if (lunar.month === "五月" && lunar.day === 5) return "端午节";
  if (lunar.month === "八月" && lunar.day === 15) return "中秋节";
  if (month === 10 && [1, 2, 3].includes(day)) return "国庆节";
  return "";
}

function getBirthday(date) {
  return birthdayMemos[recurringDateKey(date)] || null;
}

function holidaySchedule(date) {
  const item = HOLIDAY_SCHEDULE_2026[dateKey(date)];
  return item ? { name: item[0], isOffDay: item[1] } : null;
}

function saveBirthdays() {
  localStorage.setItem(BIRTHDAY_KEY, JSON.stringify(birthdayMemos));
}

function chinaWeatherUrl(city) {
  const code = CHINA_WEATHER_CODES[city];
  return code
    ? `https://www.weather.com.cn/weather1d/${code}.shtml`
    : "https://www.weather.com.cn/";
}

function weatherDescription(code) {
  const weatherCodes = {
    0: ["晴", "☀️"],
    1: ["大部晴朗", "🌤️"],
    2: ["多云", "⛅"],
    3: ["阴", "☁️"],
    45: ["有雾", "🌫️"],
    48: ["雾凇", "🌫️"],
    51: ["小毛毛雨", "🌦️"],
    53: ["毛毛雨", "🌦️"],
    55: ["较强毛毛雨", "🌧️"],
    56: ["冻毛毛雨", "🌧️"],
    57: ["较强冻毛毛雨", "🌧️"],
    61: ["小雨", "🌦️"],
    63: ["中雨", "🌧️"],
    65: ["大雨", "🌧️"],
    66: ["冻雨", "🌧️"],
    67: ["较强冻雨", "🌧️"],
    71: ["小雪", "🌨️"],
    73: ["中雪", "🌨️"],
    75: ["大雪", "❄️"],
    77: ["米雪", "🌨️"],
    80: ["小阵雨", "🌦️"],
    81: ["阵雨", "🌧️"],
    82: ["强阵雨", "⛈️"],
    85: ["小阵雪", "🌨️"],
    86: ["强阵雪", "❄️"],
    95: ["雷雨", "⛈️"],
    96: ["雷雨伴小冰雹", "⛈️"],
    99: ["雷雨伴冰雹", "⛈️"]
  };
  return weatherCodes[code] || ["天气变化中", "🌤️"];
}

function setWeatherLoading(isLoading) {
  weatherRefresh.classList.toggle("is-loading", isLoading);
  weatherRefresh.disabled = isLoading;
}

function forecastDayLabel(dateText, index) {
  if (index === 0) return "今天";
  if (index === 1) return "明天";
  if (index === 2) return "后天";
  return new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(new Date(`${dateText}T12:00:00`));
}

function safeNumber(value, fallback = null) {
  if (value === null || value === undefined || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function windDirectionName(degrees) {
  const value = safeNumber(degrees);
  if (value === null) return "风向未知";
  const names = ["北风", "东北风", "东风", "东南风", "南风", "西南风", "西风", "西北风"];
  return names[Math.round(value / 45) % 8];
}

function aqiDescription(aqi) {
  const value = safeNumber(aqi);
  if (value === null) return { text: "暂缺", className: "" };
  if (value <= 50) return { text: `${Math.round(value)} 优`, className: "air-good" };
  if (value <= 100) return { text: `${Math.round(value)} 良`, className: "air-fair" };
  if (value <= 150) return { text: `${Math.round(value)} 敏感人群不友好`, className: "air-poor" };
  return { text: `${Math.round(value)} 较差`, className: "air-poor" };
}

function uvDescription(value) {
  const uv = safeNumber(value, 0);
  if (uv < 3) return "较弱";
  if (uv < 6) return "中等";
  if (uv < 8) return "较强";
  if (uv < 11) return "很强";
  return "极强";
}

function renderWeatherMetrics(current, airCurrent) {
  const aqi = aqiDescription(airCurrent?.us_aqi);
  const pm25 = safeNumber(airCurrent?.pm2_5);
  const metrics = [
    ["体感温度", `${Math.round(safeNumber(current.apparent_temperature, current.temperature_2m))}℃`, ""],
    ["相对湿度", `${Math.round(safeNumber(current.relative_humidity_2m, 0))}%`, ""],
    ["风力风向", `${windDirectionName(current.wind_direction_10m)} ${Math.round(safeNumber(current.wind_speed_10m, 0))} km/h`, ""],
    ["阵风", `${Math.round(safeNumber(current.wind_gusts_10m, 0))} km/h`, ""],
    ["当前降水", `${safeNumber(current.precipitation, 0).toFixed(1)} mm`, ""],
    ["气压", `${Math.round(safeNumber(current.pressure_msl, 0))} hPa`, ""],
    ["云量", `${Math.round(safeNumber(current.cloud_cover, 0))}%`, ""],
    ["空气质量", `AQI ${aqi.text}${pm25 === null ? "" : ` · PM2.5 ${Math.round(pm25)}`}`, aqi.className]
  ];
  weatherMetrics.innerHTML = "";
  metrics.forEach(([label, value, className]) => {
    const card = document.createElement("div");
    card.className = `weather-metric ${className}`.trim();
    const caption = document.createElement("span");
    caption.textContent = label;
    const content = document.createElement("b");
    content.textContent = value;
    card.append(caption, content);
    weatherMetrics.appendChild(card);
  });
}

function renderWeatherLifeIndices(current, daily, airCurrent) {
  const uv = safeNumber(daily.uv_index_max?.[0], 0);
  const rain = safeNumber(daily.precipitation_probability_max?.[0], 0);
  const temperature = safeNumber(current.temperature_2m, 20);
  const aqi = safeNumber(airCurrent?.us_aqi);
  const sunrise = daily.sunrise?.[0]?.split("T")[1] || "--:--";
  const sunset = daily.sunset?.[0]?.split("T")[1] || "--:--";
  const clothing = temperature >= 30
    ? ["清凉透气", "高温时减少暴晒，及时补水。"]
    : temperature >= 20
      ? ["轻薄舒适", "早晚可根据体感准备薄外套。"]
      : temperature >= 10
        ? ["适度保暖", "建议穿长袖或增加薄外套。"]
        : ["注意保暖", "外出增加保暖层并注意手脚温度。"];
  const exercise = rain >= 60
    ? ["室内更合适", "降水概率较高，可选择室内力量训练。"]
    : temperature >= 32
      ? ["避开高温", "优先早晚运动，注意补水和体感变化。"]
      : aqi !== null && aqi > 100
        ? ["减少户外强度", "空气质量欠佳，敏感人群优先室内活动。"]
        : ["适宜活动", "天气条件较平稳，可按计划运动。"];
  const items = [
    ["🏃", "运动建议", exercise[0], exercise[1]],
    ["☂️", "降水提示", `${Math.round(rain)}%`, rain >= 40 ? "外出可准备雨具。" : "降水可能性较低。"],
    ["☀️", "紫外线", `${uv.toFixed(1)} · ${uvDescription(uv)}`, uv >= 6 ? "外出注意遮阳和防晒。" : "正常做好日常防护。"],
    ["🌬️", "空气与通风", aqiDescription(aqi).text, aqi !== null && aqi > 100 ? "减少长时间开窗和户外活动。" : "可根据体感适度通风。"],
    ["🌅", "日出日落", `${sunrise} / ${sunset}`, "安排户外活动时可参考日照时间。"],
    ["👕", "穿衣建议", clothing[0], clothing[1]]
  ];
  weatherLifeIndices.innerHTML = "";
  items.forEach(([icon, label, value, advice]) => {
    const card = document.createElement("article");
    card.className = "weather-life-card";
    const iconElement = document.createElement("span");
    iconElement.className = "weather-life-icon";
    iconElement.textContent = icon;
    const text = document.createElement("div");
    const title = document.createElement("b");
    title.textContent = `${label} · ${value}`;
    const detail = document.createElement("span");
    detail.textContent = advice;
    text.append(title, detail);
    card.append(iconElement, text);
    weatherLifeIndices.appendChild(card);
  });
}

function renderWeatherForecast(daily) {
  weatherForecast.innerHTML = "";
  daily.time.slice(0, 3).forEach((dateText, index) => {
    const [description, icon] = weatherDescription(Number(daily.weather_code[index]));
    const card = document.createElement("article");
    card.className = "weather-day";
    const label = document.createElement("span");
    label.className = "weather-day-label";
    label.textContent = forecastDayLabel(dateText, index);
    const weatherIconElement = document.createElement("span");
    weatherIconElement.className = "weather-day-icon";
    weatherIconElement.textContent = icon;
    const descriptionElement = document.createElement("span");
    descriptionElement.className = "weather-day-description";
    descriptionElement.textContent = description;
    const temperature = document.createElement("b");
    temperature.className = "weather-day-temperature";
    temperature.textContent = `${Math.round(daily.temperature_2m_min[index])}～${Math.round(daily.temperature_2m_max[index])}℃`;
    const rain = document.createElement("span");
    rain.className = "weather-day-rain";
    rain.textContent = `降水 ${daily.precipitation_probability_max[index] ?? 0}%`;
    const detail = document.createElement("span");
    detail.className = "weather-day-detail";
    detail.textContent = `风 ${Math.round(safeNumber(daily.wind_speed_10m_max?.[index], 0))} km/h · UV ${safeNumber(daily.uv_index_max?.[index], 0).toFixed(1)}`;
    card.append(label, weatherIconElement, descriptionElement, temperature, rain, detail);
    weatherForecast.appendChild(card);
  });
}

async function loadWeather() {
  weatherCity.textContent = weatherSettings.city;
  chinaWeatherLink.href = chinaWeatherUrl(weatherSettings.city);
  weatherCard.classList.remove("is-error");
  weatherSummary.textContent = "正在获取今日天气……";
  weatherMetrics.innerHTML = "";
  weatherForecast.innerHTML = "";
  weatherLifeIndices.innerHTML = "";
  setWeatherLoading(true);
  try {
    const params = new URLSearchParams({
      latitude: weatherSettings.latitude,
      longitude: weatherSettings.longitude,
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset",
      timezone: weatherSettings.timezone || "Asia/Shanghai",
      forecast_days: "3"
    });
    const airParams = new URLSearchParams({
      latitude: weatherSettings.latitude,
      longitude: weatherSettings.longitude,
      current: "us_aqi,pm2_5",
      timezone: weatherSettings.timezone || "Asia/Shanghai"
    });
    const [response, airResponse] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${params}`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${airParams}`).catch(() => null)
    ]);
    if (!response.ok) throw new Error("weather request failed");
    const data = await response.json();
    const airData = airResponse?.ok ? await airResponse.json() : null;
    const current = data.current;
    const daily = data.daily;
    if (!current || !daily) throw new Error("weather data missing");
    const [description, icon] = weatherDescription(Number(current.weather_code));
    weatherIcon.textContent = icon;
    const updateTime = current.time?.split("T")[1] || "";
    weatherSummary.textContent = `${description} · ${Math.round(current.temperature_2m)}℃ · 今日 ${Math.round(daily.temperature_2m_min[0])}～${Math.round(daily.temperature_2m_max[0])}℃${updateTime ? ` · ${updateTime} 更新` : ""}`;
    renderWeatherMetrics(current, airData?.current);
    renderWeatherForecast(daily);
    renderWeatherLifeIndices(current, daily, airData?.current);
  } catch (error) {
    weatherIcon.textContent = "🌤️";
    weatherCard.classList.add("is-error");
    weatherSummary.textContent = "暂时无法更新实时天气，可点击中国天气网查看。";
    weatherMetrics.innerHTML = '<div class="weather-forecast-empty">天气指标暂时不可用，请稍后刷新</div>';
    weatherForecast.innerHTML = '<p class="weather-forecast-empty">三日预报暂时不可用</p>';
    weatherLifeIndices.innerHTML = "";
  } finally {
    setWeatherLoading(false);
    requestAnimationFrame(syncEntryPanelHeight);
  }
}

function openWeatherSettings() {
  weatherCityInput.value = weatherSettings.city;
  weatherSettingsStatus.textContent = "输入中国城市名称，保存后会自动更新天气。";
  weatherSettingsModal.classList.add("is-open");
  weatherSettingsModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  weatherCityInput.focus();
}

function closeWeatherSettings() {
  weatherSettingsModal.classList.remove("is-open");
  weatherSettingsModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function findWeatherCity(city) {
  const params = new URLSearchParams({
    name: city,
    count: "5",
    language: "zh",
    format: "json",
    countryCode: "CN"
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!response.ok) throw new Error("city request failed");
  const data = await response.json();
  const result = data.results?.[0];
  if (!result) throw new Error("city not found");
  return {
    city: result.name.replace(/市$/, ""),
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || "Asia/Shanghai"
  };
}

function emptyHealth() {
  return { glucose: [], meals: [], exercise: [], water: [] };
}

function normalizeHealth(health) {
  const withIds = (items) => (items || []).map((item) => ({
    ...item,
    id: item.id || createId()
  }));
  return {
    glucose: withIds(health?.glucose),
    meals: withIds(health?.meals),
    exercise: withIds(health?.exercise),
    water: withIds(health?.water)
  };
}

function currentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveCustomWorkouts() {
  localStorage.setItem(WORKOUT_KEY, JSON.stringify(customWorkouts));
}

function chooseWorkouts() {
  const selectedPreset = WORKOUT_LIBRARY.includes(selectedWorkout) ? selectedWorkout : null;
  const choices = WORKOUT_LIBRARY
    .filter((workout) => workout !== selectedPreset)
    .sort(() => Math.random() - 0.5)
    .slice(0, selectedPreset ? 3 : 4);
  visibleWorkouts = selectedPreset ? [selectedPreset, ...choices] : choices;
}

function chooseTrainingBlock(type) {
  if (type === "main") {
    const candidates = WORKOUT_LIBRARY.filter((workout) => workout !== selectedWorkout);
    selectedWorkout = candidates[Math.floor(Math.random() * candidates.length)] || WORKOUT_LIBRARY[0];
    return;
  }
  const options = TRAINING_BLOCK_LIBRARY[type];
  const current = activeTrainingBlocks[type];
  const candidates = options.filter((option) => option !== current);
  activeTrainingBlocks[type] = candidates[Math.floor(Math.random() * candidates.length)] || options[0];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createTrainingBlock(type) {
  const block = type === "main"
    ? {
      label: `02 · 主力量 · ${selectedWorkout.tag || "我的训练"}`,
      title: selectedWorkout.name,
      duration: selectedWorkout.duration,
      items: selectedWorkout.exercises,
      note: selectedWorkout.note || "根据当天状态调整组数、次数和阻力，保持动作可控。"
    }
    : activeTrainingBlocks[type];
  const card = document.createElement("article");
  card.className = `training-block-card ${type}`;
  const items = block.items
    .map(([name, dose]) => `<li><span>${escapeHtml(name)}</span><span>${escapeHtml(dose)}</span></li>`)
    .join("");
  card.innerHTML = `
    <div class="training-block-head">
      <div>
        <span class="training-block-kicker">${escapeHtml(block.label)}</span>
        <h4>${escapeHtml(block.title)}</h4>
        <small>约 ${escapeHtml(block.duration)}</small>
      </div>
      <button class="refresh-block-button" type="button" data-refresh-block="${type}" aria-label="刷新${escapeHtml(block.label)}">↻</button>
    </div>
    <ul class="training-block-list">${items}</ul>
    <p class="training-block-note">${escapeHtml(block.note)}</p>
  `;
  return card;
}

function renderTrainingBlocks() {
  trainingBlocks.innerHTML = "";
  SESSION_BLOCK_ORDER.forEach((type) => {
    if (type !== "main" && !activeTrainingBlocks[type]) chooseTrainingBlock(type);
    trainingBlocks.appendChild(createTrainingBlock(type));
  });
}

function refreshTrainingBlock(type) {
  chooseTrainingBlock(type);
  renderTrainingBlocks();
}

function refreshAllTrainingBlocks() {
  SESSION_BLOCK_ORDER.forEach(chooseTrainingBlock);
  renderTrainingBlocks();
  chooseWorkouts();
  renderWorkoutPlans();
}

function workoutRecordText(workout) {
  return `${workout.name}：${workout.exercises.map(([name, dose]) => `${name}（${dose}）`).join("、")}`;
}

function fullWorkoutRecordText() {
  return SESSION_BLOCK_ORDER.map((type) => {
    if (type === "main") return `主训练：${workoutRecordText(selectedWorkout)}`;
    const block = activeTrainingBlocks[type];
    return `${block.label.replace(/^\d+\s*·\s*/, "")}：${block.items.map(([name, dose]) => `${name}（${dose}）`).join("、")}`;
  }).join("；");
}

function fullWorkoutDuration() {
  const supportingMinutes = ["warmup", "accessory", "cooldown"]
    .reduce((total, type) => total + (parseInt(activeTrainingBlocks[type].duration, 10) || 0), 0);
  return String(supportingMinutes + (parseInt(selectedWorkout.duration, 10) || 30));
}

function createWorkoutCard(workout, isCustom = false, workoutIndex = -1) {
  const card = document.createElement("article");
  const isSelected = workout === selectedWorkout;
  card.className = `workout-card${isCustom ? " is-custom" : ""}${isSelected ? " is-selected" : ""}`;
  const head = document.createElement("div");
  head.className = "workout-card-head";
  const heading = document.createElement("div");
  const tag = document.createElement("span");
  tag.textContent = isCustom ? "我的训练" : workout.tag;
  const title = document.createElement("h3");
  title.textContent = workout.name;
  heading.append(tag, title);
  const meta = document.createElement("div");
  meta.className = "workout-card-meta";
  const duration = document.createElement("small");
  duration.textContent = `约 ${workout.duration}`;
  meta.appendChild(duration);
  if (!isCustom && !isSelected) {
    const refresh = document.createElement("button");
    refresh.type = "button";
    refresh.className = "refresh-card-button";
    refresh.dataset.workoutIndex = String(workoutIndex);
    refresh.setAttribute("aria-label", `更换${workout.name}`);
    refresh.textContent = "↻";
    meta.appendChild(refresh);
  }
  head.append(heading, meta);

  const list = document.createElement("ul");
  list.className = "workout-preview";
  workout.exercises.forEach(([name]) => {
    const item = document.createElement("li");
    item.textContent = name;
    list.appendChild(item);
  });

  const note = document.createElement("p");
  note.className = "workout-dose";
  note.textContent = isSelected ? "已作为今日主训练，上方会显示完整组数与次数。" : "选择后，上方会自动搭配热身、核心辅助和放松。";
  const actions = document.createElement("div");
  actions.className = "workout-card-actions";
  const select = document.createElement("button");
  select.type = "button";
  select.className = "plan-record-button select-workout-button";
  select.dataset.workoutIndex = String(workoutIndex);
  if (isCustom) select.dataset.customWorkoutId = workout.id;
  select.disabled = isSelected;
  select.textContent = isSelected ? "当前主训练" : "选为今日主训练";
  actions.appendChild(select);
  if (isCustom) {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-workout";
    remove.dataset.workoutId = workout.id;
    remove.textContent = "删除";
    actions.appendChild(remove);
  }
  card.append(head, list, note, actions);
  return card;
}

function renderWorkoutPlans() {
  workoutPlans.innerHTML = "";
  customWorkouts.forEach((workout) => workoutPlans.appendChild(createWorkoutCard(workout, true)));
  visibleWorkouts.forEach((workout, index) => workoutPlans.appendChild(createWorkoutCard(workout, false, index)));
}

function refreshWorkoutPlans() {
  chooseWorkouts();
  renderWorkoutPlans();
}

function refreshSingleWorkout(index) {
  const alternatives = WORKOUT_LIBRARY.filter((workout) => !visibleWorkouts.includes(workout));
  const pool = alternatives.length ? alternatives : WORKOUT_LIBRARY.filter((workout) => workout !== visibleWorkouts[index]);
  visibleWorkouts[index] = pool[Math.floor(Math.random() * pool.length)];
  renderWorkoutPlans();
}

function openMainWorkoutPicker() {
  mainWorkoutPicker.classList.add("is-open");
  mainWorkoutPicker.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const toggle = document.querySelector("#toggleMainWorkoutPicker");
  toggle.setAttribute("aria-expanded", "true");
  mainWorkoutPicker.querySelector(".modal-close").focus();
}

function closeMainWorkoutPicker({ returnFocus = true } = {}) {
  mainWorkoutPicker.classList.remove("is-open");
  mainWorkoutPicker.setAttribute("aria-hidden", "true");
  customWorkoutForm.hidden = true;
  document.body.classList.remove("modal-open");
  const toggle = document.querySelector("#toggleMainWorkoutPicker");
  toggle.setAttribute("aria-expanded", "false");
  if (returnFocus) toggle.focus();
}

function selectMainWorkout(workout) {
  selectedWorkout = workout;
  renderTrainingBlocks();
  renderWorkoutPlans();
  closeMainWorkoutPicker({ returnFocus: false });
  document.querySelector("#trainingBlocks").scrollIntoView({ behavior: "smooth", block: "center" });
}

function openExerciseRecord(plan, duration = "30") {
  cancelHealthEdit();
  setEntryMode("health");
  setHealthTab("exercise");
  document.querySelector("#exerciseTime").value = currentTime();
  document.querySelector("#exerciseType").value = plan;
  document.querySelector("#exerciseDuration").value = duration;
  document.querySelector("#exerciseNote").value = "请按实际完成的重量、组数、次数和身体感受修改";
  document.querySelector(".health-entry").scrollIntoView({ behavior: "smooth", block: "center" });
  saveStatus.textContent = "训练方案已带入，请按实际完成情况修改后保存";
}

function setActiveSection(sectionId) {
  sectionNavItems.forEach((item) => {
    const isActive = item.dataset.sectionTarget === sectionId;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-current", isActive ? "true" : "false");
    if (isActive && sectionNav.scrollWidth > sectionNav.clientWidth) {
      const targetLeft = item.offsetLeft - (sectionNav.clientWidth - item.offsetWidth) / 2;
      sectionNav.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    }
  });
}

function setEntryMode(mode) {
  entryModeButtons.forEach((button) => {
    const isActive = button.dataset.entryMode === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll(".entry-mode-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.entryModePanel === mode);
  });
  document.querySelector("#entryForm").classList.toggle(
    "passive-mode",
    mode === "home" || mode === "organizer"
  );
}

function setHealthTab(tabName) {
  document.querySelectorAll(".health-tab").forEach((tab) => {
    const isActive = tab.dataset.healthTab === tabName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll(".health-form").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.healthPanel === tabName);
  });
}

function syncEntryPanelHeight() {
  if (window.innerWidth <= 1120) {
    entryPanel.style.height = "";
    return;
  }
  entryPanel.style.height = `${calendarPanel.offsetHeight}px`;
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderCalendar() {
  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();
  monthTitle.textContent = `${year}年${month + 1}月`;
  calendarGrid.innerHTML = "";

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - firstWeekday);

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const key = dateKey(date);
    const entry = entries[key] || {};
    const birthday = getBirthday(date);
    const lunar = lunarInfo(date);
    const schedule = holidaySchedule(date);
    const holiday = statutoryHoliday(date, lunar);
    const festival = schedule?.name || holiday || traditionalFestival(date, lunar);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day";
    const hasHealth = entry.health && Object.values(entry.health).some((items) => items?.length);
    const hasEntry = entry.mood || entry.thought || entry.proud || entry.memory
      || entry.plan || entry.media?.length || hasHealth || birthday;
    if (date.getMonth() !== month) button.classList.add("outside");
    if (sameDay(date, today)) button.classList.add("today");
    if (sameDay(date, selectedDate)) button.classList.add("selected");
    if (hasEntry) button.classList.add("has-entry");
    if (schedule?.isOffDay) button.classList.add("holiday-off");
    if (schedule && !schedule.isOffDay) button.classList.add("holiday-work");

    const dots = [
      entry.thought && '<i class="dot thought-dot"></i>',
      entry.proud && '<i class="dot proud-dot"></i>',
      entry.memory && '<i class="dot memory-dot"></i>',
      entry.media?.length && '<i class="dot media-dot"></i>',
      hasHealth && '<i class="dot health-dot"></i>',
      entry.plan && '<i class="dot plan-dot"></i>',
      birthday && '<i class="dot birthday-dot"></i>'
    ].filter(Boolean).join("");

    button.innerHTML = `
      <span class="day-lunar">${lunar.short}</span>
      <span class="day-date-row">
        <span class="day-number">${date.getDate()}</span>
        ${schedule ? `<span class="day-status">${schedule.isOffDay ? "休" : "班"}</span>` : ""}
      </span>
      ${entry.mood ? `<span class="day-mood">${entry.mood}</span>` : ""}
      ${festival ? `<span class="day-festival">${festival}</span>` : ""}
      ${birthday ? '<span class="day-birthday" aria-hidden="true">🎂</span>' : ""}
      <span class="day-dots">${dots}</span>
    `;
    button.setAttribute(
      "aria-label",
      `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${schedule ? `，${schedule.name}${schedule.isOffDay ? "放假" : "调休上班"}` : ""}`
    );
    button.addEventListener("click", () => {
      selectDate(date);
      if (hasEntry) openRecord(date);
      else animateEntryPanel();
    });
    calendarGrid.appendChild(button);
  }
  requestAnimationFrame(syncEntryPanelHeight);
}

function selectDate(date) {
  selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  timelineDate = new Date(selectedDate);
  selectedTimelineEvent = 0;
  if (date.getMonth() !== visibleDate.getMonth() || date.getFullYear() !== visibleDate.getFullYear()) {
    visibleDate = new Date(date.getFullYear(), date.getMonth(), 1);
  }
  loadEntry();
  renderCalendar();
}

function animateEntryPanel() {
  entryPanel.classList.remove("is-switching");
  void entryPanel.offsetWidth;
  entryPanel.classList.add("is-switching");
  if (window.innerWidth <= 980) {
    entryPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function loadEntry() {
  const entry = entries[dateKey(selectedDate)] || {};
  selectedDateTitle.textContent = `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
  selectedWeekday.textContent = new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(selectedDate);
  thoughtInput.value = entry.thought || "";
  proudInput.value = entry.proud || "";
  memoryInput.value = entry.memory || "";
  selectedMood = entry.mood || "";
  selectedPlan = entry.plan || "";
  selectedPlanPriority = entry.planPriority || "normal";
  const birthday = getBirthday(selectedDate) || {};
  organizerDate.textContent = `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日 · ${lunarInfo(selectedDate).full}`;
  dayPlanInput.value = selectedPlan;
  dayPlanPriority.value = selectedPlanPriority;
  birthdayName.value = birthday.name || "";
  birthdayNote.value = birthday.note || "";
  pendingMedia = [...(entry.media || [])];
  pendingHealth = normalizeHealth(entry.health);
  cancelHealthEdit();
  document.querySelectorAll("#moodPicker button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mood === selectedMood);
  });
  renderMedia();
  renderTodayHealth();
  renderHealthDashboard();
  renderCalendarInfo();
  saveStatus.textContent = "写下的内容会自动保存在本机";
  requestAnimationFrame(syncEntryPanelHeight);
}

function renderCalendarInfo() {
  const lunar = lunarInfo(selectedDate);
  const schedule = holidaySchedule(selectedDate);
  const holiday = statutoryHoliday(selectedDate, lunar);
  const festival = traditionalFestival(selectedDate, lunar);
  const birthday = getBirthday(selectedDate);
  const labels = [
    ["农历", `${lunar.month}${lunar.dayName}`],
    ["干支生肖", `${lunar.yearName}年 · ${lunar.zodiac}年`],
    ["节日", schedule
      ? `${schedule.name} · ${schedule.isOffDay ? "放假" : "调休上班"}`
      : (holiday ? `${holiday} · 法定节日` : (festival || "普通日"))],
    ["备忘", birthday ? `🎂 ${birthday.name}` : (selectedPlan ? "已有日计划" : "暂无")]
  ];
  calendarInfo.innerHTML = "";
  labels.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "calendar-info-item";
    const caption = document.createElement("span");
    caption.textContent = label;
    const content = document.createElement("b");
    content.textContent = value;
    item.append(caption, content);
    calendarInfo.appendChild(item);
  });
  const note = document.createElement("p");
  note.className = "calendar-info-note";
  note.textContent = "黄历信息为传统历法文化参考；放假调休以国务院当年正式通知为准。";
  calendarInfo.appendChild(note);
}

function renderMedia() {
  mediaPreview.innerHTML = "";
  pendingMedia.forEach((item, index) => {
    const fragment = document.querySelector("#mediaTemplate").content.cloneNode(true);
    const content = fragment.querySelector(".media-content");
    const name = fragment.querySelector(".media-name");
    const remove = fragment.querySelector(".remove-media");

    if (item.type.startsWith("image/")) {
      content.innerHTML = `<img src="${item.data}" alt="">`;
    } else if (item.type.startsWith("video/")) {
      content.innerHTML = `<video src="${item.data}" controls></video>`;
    } else if (item.type.startsWith("audio/")) {
      content.innerHTML = `<audio src="${item.data}" controls></audio>`;
    } else {
      content.innerHTML = '<div class="media-placeholder">♪</div>';
    }

    content.addEventListener("click", () => openLightbox(item));
    name.textContent = item.name;
    remove.addEventListener("click", () => {
      pendingMedia.splice(index, 1);
      renderMedia();
      autoSave();
    });
    mediaPreview.appendChild(fragment);
  });
}

function healthItemsForToday() {
  return [
    ...pendingHealth.glucose.map((item) => ({
      ...item, group: "glucose", icon: "●",
      label: `${item.value} mmol/L`, detail: item.context, note: item.note
    })),
    ...pendingHealth.meals.map((item) => ({
      ...item, group: "meals", icon: "餐",
      label: item.type, detail: item.food, note: item.note
    })),
    ...pendingHealth.exercise.map((item) => ({
      ...item, group: "exercise", icon: "动",
      label: item.type, detail: `${item.duration}分钟`, note: item.note
    })),
    ...pendingHealth.water.map((item) => ({
      ...item, group: "water", icon: "水",
      label: `${item.amount} ml`, detail: "饮水", note: item.note
    }))
  ].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
}

function renderTodayHealth() {
  todayHealthList.innerHTML = "";
  const items = healthItemsForToday();
  if (!items.length) {
    todayHealthList.innerHTML = '<p class="health-empty">今天还没有健康记录</p>';
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "health-log-item";
    const icon = document.createElement("span");
    icon.className = "health-log-icon";
    icon.textContent = item.icon;
    const time = document.createElement("span");
    time.className = "health-log-time";
    time.textContent = item.time;
    const main = document.createElement("span");
    main.className = "health-log-main";
    const label = document.createElement("b");
    label.textContent = item.label;
    main.append(label, document.createTextNode(item.detail ? ` · ${item.detail}` : ""));
    if (item.note) {
      const note = document.createElement("small");
      note.className = "health-log-note";
      note.textContent = `备注：${item.note}`;
      main.appendChild(note);
    }
    const actions = document.createElement("span");
    actions.className = "health-log-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "edit-health";
    edit.setAttribute("aria-label", "编辑这条健康记录");
    edit.title = "修改记录";
    edit.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4l10.6-10.6a1.8 1.8 0 0 0 0-2.6l-1.4-1.4a1.8 1.8 0 0 0-2.6 0L4 16v4Z"></path>
        <path d="m13.5 6.5 4 4"></path>
      </svg>
    `;
    edit.addEventListener("click", () => beginHealthEdit(item));
    actions.appendChild(edit);
    row.append(icon, time, main, actions);
    todayHealthList.appendChild(row);
  });
}

function addHealthRecord(group, record) {
  if (editingHealth?.group === group) {
    pendingHealth[group] = pendingHealth[group].map((item) => (
      item.id === editingHealth.id ? { ...item, ...record } : item
    ));
  } else {
    pendingHealth[group].push({ id: createId(), ...record });
  }
  cancelHealthEdit();
  autoSave();
  renderTodayHealth();
  renderHealthDashboard();
}

const healthFormConfig = {
  glucose: {
    tab: "glucose",
    button: "addGlucose",
    addLabel: "＋ 添加血糖",
    editLabel: "保存血糖修改",
    fields: {
      glucoseTime: "time", glucoseValue: "value",
      glucoseContext: "context", glucoseNote: "note"
    }
  },
  meals: {
    tab: "meal",
    button: "addMeal",
    addLabel: "＋ 添加餐食",
    editLabel: "保存餐食修改",
    fields: {
      mealTime: "time", mealType: "type",
      mealFood: "food", mealNote: "note"
    }
  },
  exercise: {
    tab: "exercise",
    button: "addExercise",
    addLabel: "＋ 添加运动",
    editLabel: "保存运动修改",
    fields: {
      exerciseTime: "time", exerciseType: "type",
      exerciseDuration: "duration", exerciseNote: "note"
    }
  },
  water: {
    tab: "water",
    button: "addWater",
    addLabel: "＋ 记录喝水",
    editLabel: "保存饮水修改",
    fields: {
      waterTime: "time", waterAmount: "amount", waterNote: "note"
    }
  }
};

function cancelHealthEdit() {
  editingHealth = null;
  Object.values(healthFormConfig).forEach((config) => {
    document.querySelector(`#${config.button}`).textContent = config.addLabel;
  });
}

function beginHealthEdit(item) {
  const config = healthFormConfig[item.group];
  if (!config) return;
  editingHealth = { group: item.group, id: item.id };
  setEntryMode("health");
  setHealthTab(config.tab);
  Object.entries(config.fields).forEach(([inputId, key]) => {
    document.querySelector(`#${inputId}`).value = item[key] ?? "";
  });
  document.querySelector(`#${config.button}`).textContent = config.editLabel;
  document.querySelector(`[data-health-panel="${config.tab}"]`).scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
  saveStatus.textContent = "正在修改这条记录，完成后点击保存修改";
}

function inputValue(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function openRecord(date) {
  const entry = entries[dateKey(date)] || {};
  const birthday = getBirthday(date);
  if (!Object.keys(entry).length && !birthday) return;

  recordWeekday.textContent = new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(date);
  recordDate.textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  recordMood.textContent = entry.mood || "☀️";
  recordBody.innerHTML = "";

  const sections = [
    ["日计划", entry.plan, "plan-block"],
    ["人生思考", entry.thought, "thought-block"],
    ["我做得不错", entry.proud, "proud-block"],
    ["值得纪念", entry.memory, "memory-block"]
  ];

  sections.forEach(([label, text, className]) => {
    if (!text) return;
    const block = document.createElement("section");
    block.className = `record-block ${className}`;
    const title = document.createElement("p");
    title.className = "record-label";
    title.textContent = label;
    const content = document.createElement("p");
    content.className = "record-text";
    content.textContent = text;
    block.append(title, content);
    recordBody.appendChild(block);
  });

  if (birthday) {
    const block = document.createElement("section");
    block.className = "record-block birthday-block";
    const title = document.createElement("p");
    title.className = "record-label";
    title.textContent = "生日备忘";
    const content = document.createElement("p");
    content.className = "record-text";
    content.textContent = `🎂 ${birthday.name}${birthday.note ? `\n${birthday.note}` : ""}`;
    block.append(title, content);
    recordBody.appendChild(block);
  }

  const health = normalizeHealth(entry.health);
  const healthItems = [
    ...health.glucose.map((item) => ({ ...item, text: `血糖 ${item.value} mmol/L · ${item.context}${item.note ? ` · 备注：${item.note}` : ""}` })),
    ...health.meals.map((item) => ({ ...item, text: `${item.type} · ${item.food}${item.note ? ` · ${item.note}` : ""}` })),
    ...health.exercise.map((item) => ({ ...item, text: `运动 · ${item.type} ${item.duration}分钟${item.note ? ` · ${item.note}` : ""}` })),
    ...health.water.map((item) => ({ ...item, text: `喝水 · ${item.amount} ml${item.note ? ` · 备注：${item.note}` : ""}` }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  if (healthItems.length) {
    const block = document.createElement("section");
    block.className = "record-block proud-block";
    const title = document.createElement("p");
    title.className = "record-label";
    title.textContent = "健康记录";
    block.appendChild(title);
    healthItems.forEach((item) => {
      const content = document.createElement("p");
      content.className = "record-text";
      content.textContent = `${item.time}  ${item.text}`;
      block.appendChild(content);
    });
    recordBody.appendChild(block);
  }

  if (entry.media?.length) {
    const title = document.createElement("h3");
    title.className = "record-media-title";
    title.textContent = "这一天的影像与声音";
    const grid = document.createElement("div");
    grid.className = "record-media-grid";
    entry.media.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "record-media";
      button.setAttribute("aria-label", `查看 ${item.name}`);
      if (item.type.startsWith("image/")) {
        button.innerHTML = `<img src="${item.data}" alt="${item.name}">`;
      } else if (item.type.startsWith("video/")) {
        button.innerHTML = `<video src="${item.data}" controls></video>`;
      } else if (item.type.startsWith("audio/")) {
        button.innerHTML = `<audio src="${item.data}" controls></audio>`;
      } else {
        button.innerHTML = '<span class="media-placeholder">♪</span>';
      }
      button.addEventListener("click", (event) => {
        if (event.target.closest("audio, video")) return;
        openLightbox(item);
      });
      grid.appendChild(button);
    });
    recordBody.append(title, grid);
  }

  recordModal.classList.add("is-open");
  recordModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  recordModal.querySelector(".modal-close").focus();
}

function closeRecord() {
  recordModal.classList.remove("is-open");
  recordModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openClearModal() {
  const hasEntry = Boolean(entries[dateKey(selectedDate)]);
  document.querySelector("#clearDescription").textContent = hasEntry
    ? "将清除当天的生活、健康、媒体和日计划记录。生日备忘会单独保留。"
    : "这一天没有已保存的生活、健康、媒体或日计划记录。";
  clearModal.classList.add("is-open");
  clearModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelector("#confirmClearEntry").focus();
}

function closeClearModal() {
  clearModal.classList.remove("is-open");
  clearModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openLightbox(item) {
  lightboxContent.innerHTML = "";
  let media;
  if (item.type.startsWith("image/")) {
    media = document.createElement("img");
    media.alt = item.name;
  } else if (item.type.startsWith("video/")) {
    media = document.createElement("video");
    media.controls = true;
    media.autoplay = true;
  } else if (item.type.startsWith("audio/")) {
    media = document.createElement("audio");
    media.controls = true;
    media.autoplay = true;
  } else {
    return;
  }
  media.src = item.data;
  lightboxContent.appendChild(media);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxContent.innerHTML = "";
}

function autoSave() {
  const key = dateKey(selectedDate);
  const entry = {
    mood: selectedMood,
    thought: thoughtInput.value.trim(),
    proud: proudInput.value.trim(),
    memory: memoryInput.value.trim(),
    plan: selectedPlan,
    planPriority: selectedPlanPriority,
    media: pendingMedia,
    health: normalizeHealth(pendingHealth)
  };

  const hasHealth = Object.values(entry.health).some((items) => items.length);
  const hasContent = entry.mood || entry.thought || entry.proud || entry.memory
    || entry.plan || entry.media.length || hasHealth;
  if (hasContent) entries[key] = entry;
  else delete entries[key];

  try {
    saveEntries();
    saveStatus.textContent = "已自动保存";
  } catch (error) {
    saveStatus.textContent = "媒体较大，浏览器存储空间不足";
  }
  renderCalendar();
  renderHealthDashboard();
}

function getRangeDates(days, anchor = selectedDate) {
  const dates = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - offset);
    dates.push(date);
  }
  return dates;
}

function collectGlucose(days) {
  return getRangeDates(days, timelineDate).flatMap((date) => {
    const readings = entries[dateKey(date)]?.health?.glucose || [];
    return readings.map((item) => ({
      ...item,
      date,
      timestamp: new Date(`${dateKey(date)}T${item.time || "00:00"}`).getTime()
    }));
  }).sort((a, b) => a.timestamp - b.timestamp);
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function healthEventsForDate(date) {
  const health = normalizeHealth(entries[dateKey(date)]?.health);
  return [
    ...health.glucose.map((item) => ({
      ...item, kind: "glucose", kindLabel: "血糖", icon: "●",
      main: `${item.value} mmol/L · ${item.context}`
    })),
    ...health.meals.map((item) => ({
      ...item, kind: "meal", kindLabel: "餐食", icon: "餐",
      main: `${item.type} · ${item.food}`
    })),
    ...health.exercise.map((item) => ({
      ...item, kind: "exercise", kindLabel: "运动", icon: "动",
      main: `${item.type} · ${item.duration}分钟`
    })),
    ...health.water.map((item) => ({
      ...item, kind: "water", kindLabel: "饮水", icon: "水",
      main: `${item.amount} ml`
    }))
  ].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
}

function renderGlucoseChart() {
  const readings = collectGlucose(trendRange);
  const dayEvents = healthEventsForDate(timelineDate);
  selectedTimelineEvent = dayEvents.length
    ? Math.min(selectedTimelineEvent, dayEvents.length - 1)
    : 0;
  glucoseChart.innerHTML = "";
  trendSummary.innerHTML = "";
  chartDateLegend.innerHTML = "";
  chartEmpty.classList.toggle("hidden", readings.length > 0 || dayEvents.length > 0);

  if (!readings.length) {
    trendSummary.innerHTML = '<div class="summary-chip">记录范围<b>暂无血糖数据</b></div>';
  } else {
    const values = readings.map((item) => Number(item.value));
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const postMeal = readings.filter((item) => item.context === "餐后2小时");
    const postMealAverage = postMeal.length
      ? postMeal.reduce((sum, item) => sum + Number(item.value), 0) / postMeal.length
      : null;
    const exerciseDays = getRangeDates(trendRange, timelineDate)
      .filter((date) => entries[dateKey(date)]?.health?.exercise?.length).length;

    [
      ["记录次数", `${readings.length}次`],
      ["平均值", `${average.toFixed(1)} mmol/L`],
      ["范围", `${Math.min(...values).toFixed(1)}–${Math.max(...values).toFixed(1)}`],
      ["餐后2小时均值", postMealAverage === null ? "暂无" : `${postMealAverage.toFixed(1)} mmol/L`],
      ["有运动的天数", `${exerciseDays}天`]
    ].forEach(([label, value]) => {
      const chip = document.createElement("div");
      chip.className = "summary-chip";
      chip.textContent = label;
      const strong = document.createElement("b");
      strong.textContent = value;
      chip.appendChild(strong);
      trendSummary.appendChild(chip);
    });
  }

  const width = 900;
  const height = 350;
  const margin = { top: 22, right: 24, bottom: 92, left: 48 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const values = readings.map((item) => Number(item.value));
  let minValue = values.length ? Math.floor(Math.min(...values) - 1) : 3;
  let maxValue = values.length ? Math.ceil(Math.max(...values) + 1) : 10;
  if (maxValue - minValue < 4) {
    minValue -= 1;
    maxValue += 1;
  }
  minValue = Math.max(0, minValue);
  const xFor = (time) => {
    const [hour = 0, minute = 0] = (time || "00:00").split(":").map(Number);
    return margin.left + ((hour * 60 + minute) / 1440) * chartWidth;
  };
  const yFor = (value) => margin.top + ((maxValue - value) / (maxValue - minValue)) * chartHeight;

  for (let index = 0; index <= 4; index += 1) {
    const value = maxValue - ((maxValue - minValue) / 4) * index;
    const y = margin.top + (chartHeight / 4) * index;
    glucoseChart.appendChild(svgElement("line", {
      x1: margin.left, y1: y, x2: width - margin.right, y2: y, class: "chart-grid-line"
    }));
    const label = svgElement("text", { x: margin.left - 9, y: y + 4, "text-anchor": "end", class: "chart-axis-text" });
    label.textContent = value.toFixed(1);
    glucoseChart.appendChild(label);
  }

  [0, 4, 8, 12, 16, 20, 24].forEach((hour) => {
    const x = margin.left + (hour / 24) * chartWidth;
    glucoseChart.appendChild(svgElement("line", {
      x1: x, y1: margin.top, x2: x, y2: margin.top + chartHeight, class: "chart-date-grid-line"
    }));
    const label = svgElement("text", {
      x,
      y: height - 12,
      "text-anchor": "middle",
      class: "chart-axis-text"
    });
    label.textContent = `${String(hour).padStart(2, "0")}:00`;
    glucoseChart.appendChild(label);
  });

  const grouped = new Map();
  readings.forEach((item) => {
    const key = dateKey(item.date);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  });
  const groups = [...grouped.entries()];
  groups.forEach(([key, dayReadings], index) => {
    const date = dayReadings[0].date;
    const recency = groups.length === 1 ? 1 : index / (groups.length - 1);
    const hue = (145 + index * 47) % 360;
    const color = `hsl(${hue} 38% 46%)`;
    const opacity = 0.24 + recency * 0.7;
    const points = dayReadings.map((item) => ({
      x: xFor(item.time),
      y: yFor(Number(item.value)),
      item,
      eventIndex: key === dateKey(timelineDate)
        ? dayEvents.findIndex((event) => event.kind === "glucose"
          && event.time === item.time
          && String(event.value) === String(item.value)
          && event.context === item.context)
        : -1
    }));
    if (points.length > 1) {
      const path = points.map((point, pointIndex) => `${pointIndex ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
      glucoseChart.appendChild(svgElement("path", {
        d: path,
        class: "chart-day-line",
        stroke: color,
        opacity: opacity.toFixed(2)
      }));
    }
    points.forEach(({ x, y, item, eventIndex }) => {
      const circle = svgElement("circle", {
        cx: x,
        cy: y,
        r: index === groups.length - 1 ? 5 : 4,
        class: `chart-day-point${eventIndex === selectedTimelineEvent ? " active" : ""}`,
        fill: "#fffdf8",
        stroke: color,
        opacity: Math.min(1, opacity + 0.12).toFixed(2),
        ...(eventIndex >= 0 ? { "data-timeline-event": eventIndex } : {})
      });
      const title = svgElement("title");
      title.textContent = `${date.getMonth() + 1}月${date.getDate()}日 ${item.time} · ${item.context} · ${item.value} mmol/L${item.note ? ` · ${item.note}` : ""}`;
      circle.appendChild(title);
      glucoseChart.appendChild(circle);
    });

    const legend = document.createElement("span");
    legend.className = index === groups.length - 1 ? "is-latest" : "";
    const swatch = document.createElement("i");
    swatch.style.background = color;
    swatch.style.opacity = String(opacity);
    legend.append(swatch, document.createTextNode(`${date.getMonth() + 1}/${date.getDate()}`));
    chartDateLegend.appendChild(legend);
  });

  const eventColors = { meal: "#d89b3d", exercise: "#6f8fd1", water: "#4ea3b8" };
  const eventLaneY = margin.top + chartHeight + 28;
  glucoseChart.appendChild(svgElement("line", {
    x1: margin.left,
    y1: eventLaneY,
    x2: width - margin.right,
    y2: eventLaneY,
    class: "chart-event-lane"
  }));
  dayEvents
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.kind !== "glucose")
    .forEach(({ item, index }, laneIndex) => {
      const group = svgElement("g", {
        class: `chart-life-event ${item.kind}${index === selectedTimelineEvent ? " active" : ""}`,
        "data-timeline-event": index,
        transform: `translate(${xFor(item.time)} ${eventLaneY + (laneIndex % 2 ? 13 : -8)})`,
        tabindex: "0",
        role: "button",
        "aria-label": `${item.time} ${item.kindLabel} ${item.main}`
      });
      group.appendChild(svgElement("circle", {
        cx: 0, cy: 0, r: 13, fill: eventColors[item.kind]
      }));
      const label = svgElement("text", {
        x: 0, y: 4, "text-anchor": "middle", class: "chart-life-event-label"
      });
      label.textContent = item.icon;
      const title = svgElement("title");
      title.textContent = `${item.time} · ${item.kindLabel} · ${item.main}${item.note ? ` · ${item.note}` : ""}`;
      group.append(label, title);
      glucoseChart.appendChild(group);
    });
}

function renderTimeline() {
  healthTimeline.innerHTML = "";
  const health = normalizeHealth(entries[dateKey(timelineDate)]?.health);
  const events = healthEventsForDate(timelineDate);
  timelineEvents = events;

  const weekday = new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(timelineDate);
  timelineDateSummary.textContent = `${timelineDate.getMonth() + 1}月${timelineDate.getDate()}日 · ${weekday} · ${events.length}条记录`;
  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "timeline-empty";
    empty.textContent = "这一天还没有健康记录";
    healthTimeline.appendChild(empty);
  } else {
    selectedTimelineEvent = Math.min(selectedTimelineEvent, events.length - 1);
    const counts = {
      glucose: health.glucose.length,
      meal: health.meals.length,
      exercise: health.exercise.length,
      water: health.water.length
    };
    const top = document.createElement("div");
    top.className = "rhythm-topline";
    const countRow = document.createElement("div");
    countRow.className = "rhythm-counts";
    [["血糖", counts.glucose], ["餐食", counts.meal], ["运动", counts.exercise], ["饮水", counts.water]].forEach(([label, count]) => {
      const chip = document.createElement("span");
      chip.className = "rhythm-count";
      const strong = document.createElement("b");
      strong.textContent = count;
      chip.append(strong, document.createTextNode(label));
      countRow.appendChild(chip);
    });
    const legend = document.createElement("div");
    legend.className = "rhythm-legend";
    [["glucose", "血糖"], ["meal", "餐食"], ["exercise", "运动"], ["water", "饮水"]].forEach(([kind, label]) => {
      const item = document.createElement("span");
      item.className = kind;
      item.innerHTML = `<i></i>${label}`;
      legend.appendChild(item);
    });
    top.append(countRow, legend);
    healthTimeline.appendChild(top);

    const detail = document.createElement("div");
    detail.id = "rhythmDetail";
    healthTimeline.appendChild(detail);
    renderRhythmDetail(events[selectedTimelineEvent]);
    const hint = document.createElement("p");
    hint.className = "rhythm-swipe-hint";
    hint.textContent = "点击图中的血糖、餐食、运动或饮水节点查看详情";
    healthTimeline.appendChild(hint);
  }
}

function renderRhythmDetail(item) {
  const detail = document.querySelector("#rhythmDetail");
  if (!detail || !item) return;
  detail.className = `rhythm-detail ${item.kind}`;
  detail.innerHTML = "";
  const icon = document.createElement("span");
  icon.className = "rhythm-detail-icon";
  icon.textContent = item.kind === "glucose" ? "●" : item.icon;
  const body = document.createElement("div");
  const head = document.createElement("div");
  head.className = "rhythm-detail-head";
  const title = document.createElement("b");
  title.textContent = item.kindLabel;
  const time = document.createElement("time");
  time.textContent = item.time || "--:--";
  head.append(title, time);
  const main = document.createElement("p");
  main.className = "rhythm-detail-main";
  main.textContent = item.main;
  body.append(head, main);
  if (item.note) {
    const note = document.createElement("p");
    note.className = "rhythm-detail-note";
    note.textContent = `备注：${item.note}`;
    body.appendChild(note);
  }
  detail.append(icon, body);
}

function changeTimelineDay(offset) {
  timelineDate = new Date(timelineDate.getFullYear(), timelineDate.getMonth(), timelineDate.getDate() + offset);
  selectedTimelineEvent = 0;
  renderGlucoseChart();
  renderTimeline();
  renderPatterns();
}

glucoseChart.addEventListener("click", (event) => {
  const node = event.target.closest("[data-timeline-event]");
  if (!node) return;
  selectedTimelineEvent = Number(node.dataset.timelineEvent);
  renderGlucoseChart();
  renderTimeline();
});

glucoseChart.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  const node = event.target.closest("[data-timeline-event]");
  if (!node) return;
  event.preventDefault();
  selectedTimelineEvent = Number(node.dataset.timelineEvent);
  renderGlucoseChart();
  renderTimeline();
});

document.querySelector("#previousTimelineDay").addEventListener("click", () => changeTimelineDay(-1));
document.querySelector("#nextTimelineDay").addEventListener("click", () => changeTimelineDay(1));
document.querySelector("#timelineToday").addEventListener("click", () => {
  timelineDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  selectedTimelineEvent = 0;
  renderGlucoseChart();
  renderTimeline();
  renderPatterns();
});

function timestampFor(date, time) {
  return new Date(`${dateKey(date)}T${time || "00:00"}`).getTime();
}

function collectHealthEvents(days) {
  const glucose = [];
  const meals = [];
  const exercise = [];
  getRangeDates(days, timelineDate).forEach((date) => {
    const health = normalizeHealth(entries[dateKey(date)]?.health);
    health.glucose.forEach((item) => glucose.push({
      ...item, date, timestamp: timestampFor(date, item.time), value: Number(item.value)
    }));
    health.meals.forEach((item) => meals.push({
      ...item, date, timestamp: timestampFor(date, item.time)
    }));
    health.exercise.forEach((item) => exercise.push({
      ...item, date, timestamp: timestampFor(date, item.time)
    }));
  });
  glucose.sort((a, b) => a.timestamp - b.timestamp);
  meals.sort((a, b) => a.timestamp - b.timestamp);
  exercise.sort((a, b) => a.timestamp - b.timestamp);
  return { glucose, meals, exercise };
}

function latestReading(readings, start, end) {
  const matches = readings.filter((item) => item.timestamp >= start && item.timestamp <= end);
  return matches[matches.length - 1];
}

function firstReading(readings, start, end) {
  return readings.find((item) => item.timestamp >= start && item.timestamp <= end);
}

function mealAssociations(events) {
  return events.meals.flatMap((meal) => {
    const before = latestReading(events.glucose, meal.timestamp - 120 * 60000, meal.timestamp);
    const after = firstReading(events.glucose, meal.timestamp + 60 * 60000, meal.timestamp + 180 * 60000);
    if (!before || !after) return [];
    return [{
      name: `${meal.type} · ${meal.food}`,
      date: meal.date,
      before: before.value,
      after: after.value,
      delta: after.value - before.value
    }];
  });
}

function exerciseAssociations(events) {
  return events.exercise.flatMap((exercise) => {
    const endTime = exercise.timestamp + Number(exercise.duration || 0) * 60000;
    const before = latestReading(events.glucose, exercise.timestamp - 120 * 60000, exercise.timestamp);
    const after = firstReading(events.glucose, endTime, endTime + 180 * 60000);
    if (!before || !after) return [];
    return [{
      name: `${exercise.type} · ${exercise.duration}分钟`,
      date: exercise.date,
      before: before.value,
      after: after.value,
      delta: after.value - before.value
    }];
  });
}

function groupAssociations(items) {
  const groups = new Map();
  items.forEach((item) => {
    const key = item.name.trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, { name: item.name, items: [] });
    groups.get(key).items.push(item);
  });
  return [...groups.values()].map((group) => ({
    name: group.name,
    count: group.items.length,
    averageDelta: group.items.reduce((sum, item) => sum + item.delta, 0) / group.items.length,
    latest: group.items[group.items.length - 1]
  })).sort((a, b) => b.count - a.count || Math.abs(b.averageDelta) - Math.abs(a.averageDelta));
}

function changeClass(delta) {
  if (delta > 0.2) return "up";
  if (delta < -0.2) return "down";
  return "steady";
}

function renderPatternList(container, groups, emptyText) {
  container.innerHTML = "";
  if (!groups.length) {
    const empty = document.createElement("p");
    empty.className = "pattern-empty";
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }
  groups.slice(0, 8).forEach((group) => {
    const row = document.createElement("article");
    row.className = "pattern-item";
    const name = document.createElement("p");
    name.className = "pattern-name";
    name.textContent = group.name;
    const detail = document.createElement("small");
    detail.textContent = group.count > 1
      ? `${group.count}次配对的平均变化`
      : `${group.latest.before.toFixed(1)} → ${group.latest.after.toFixed(1)} mmol/L · 仅1次`;
    name.appendChild(detail);
    const change = document.createElement("span");
    change.className = `pattern-change ${changeClass(group.averageDelta)}`;
    change.textContent = `${group.averageDelta >= 0 ? "+" : ""}${group.averageDelta.toFixed(1)}`;
    row.append(name, change);
    container.appendChild(row);
  });
}

function renderPatterns() {
  const events = collectHealthEvents(trendRange);
  const mealItems = mealAssociations(events);
  const exerciseItems = exerciseAssociations(events);
  const mealGroups = groupAssociations(mealItems);
  const exerciseGroups = groupAssociations(exerciseItems);
  patternSummary.innerHTML = "";

  [
    ["餐食有效配对", `${mealItems.length}次`],
    ["运动有效配对", `${exerciseItems.length}次`],
    ["当前观察范围", `${trendRange}天`]
  ].forEach(([label, value]) => {
    const chip = document.createElement("div");
    chip.className = "summary-chip";
    chip.textContent = label;
    const strong = document.createElement("b");
    strong.textContent = value;
    chip.appendChild(strong);
    patternSummary.appendChild(chip);
  });

  renderPatternList(
    mealPatterns,
    mealGroups,
    "需要在餐前2小时内和餐后1–3小时内各记录一次血糖，才能形成餐食配对。"
  );
  renderPatternList(
    exercisePatterns,
    exerciseGroups,
    "需要在运动前2小时内和运动结束后3小时内各记录一次血糖，才能形成运动配对。"
  );
}

function renderHealthDashboard() {
  renderGlucoseChart();
  renderTimeline();
  renderPatterns();
}

document.querySelector("#prevMonth").addEventListener("click", () => {
  visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1);
  renderCalendar();
  animateCalendar();
});

document.querySelector("#nextMonth").addEventListener("click", () => {
  visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1);
  renderCalendar();
  animateCalendar();
});

document.querySelector("#todayBtn").addEventListener("click", () => {
  visibleDate = new Date(today.getFullYear(), today.getMonth(), 1);
  selectDate(today);
  animateCalendar();
});

function animateCalendar() {
  calendarGrid.classList.remove("is-changing");
  void calendarGrid.offsetWidth;
  calendarGrid.classList.add("is-changing");
}

document.querySelector("#moodPicker").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mood]");
  if (!button) return;
  selectedMood = selectedMood === button.dataset.mood ? "" : button.dataset.mood;
  loadMoodState();
  autoSave();
});

function loadMoodState() {
  document.querySelectorAll("#moodPicker button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mood === selectedMood);
  });
}

[thoughtInput, proudInput, memoryInput].forEach((input) => {
  let timer;
  input.addEventListener("input", () => {
    saveStatus.textContent = "正在记录……";
    clearTimeout(timer);
    timer = setTimeout(autoSave, 450);
  });
});

document.querySelector("#entryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  autoSave();
  saveStatus.textContent = "今天的阳光已收藏";
});

mediaInput.addEventListener("change", async () => {
  const files = [...mediaInput.files];
  for (const file of files) {
    if (file.size > 4 * 1024 * 1024) {
      saveStatus.textContent = `${file.name} 超过 4 MB，暂未添加`;
      continue;
    }
    const data = await readFile(file);
    pendingMedia.push({ name: file.name, type: file.type, data });
  }
  mediaInput.value = "";
  renderMedia();
  autoSave();
});

document.querySelector(".health-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-health-tab]");
  if (!button) return;
  setHealthTab(button.dataset.healthTab);
});

document.querySelector(".entry-mode-switch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-entry-mode]");
  if (!button) return;
  setEntryMode(button.dataset.entryMode);
});

document.querySelector("#addGlucose").addEventListener("click", () => {
  const wasEditing = editingHealth?.group === "glucose";
  const value = Number(inputValue("glucoseValue"));
  if (!Number.isFinite(value) || value <= 0) {
    saveStatus.textContent = "请填写有效的血糖值";
    document.querySelector("#glucoseValue").focus();
    return;
  }
  addHealthRecord("glucose", {
    time: inputValue("glucoseTime") || currentTime(),
    value: value.toFixed(1),
    context: inputValue("glucoseContext"),
    note: inputValue("glucoseNote")
  });
  document.querySelector("#glucoseValue").value = "";
  document.querySelector("#glucoseNote").value = "";
  saveStatus.textContent = wasEditing ? "血糖记录已修改" : "血糖记录已保存";
});

document.querySelector("#addMeal").addEventListener("click", () => {
  const wasEditing = editingHealth?.group === "meals";
  const food = inputValue("mealFood");
  if (!food) {
    saveStatus.textContent = "请简单写下吃了什么";
    document.querySelector("#mealFood").focus();
    return;
  }
  addHealthRecord("meals", {
    time: inputValue("mealTime") || currentTime(),
    type: inputValue("mealType"),
    food,
    note: inputValue("mealNote")
  });
  document.querySelector("#mealFood").value = "";
  document.querySelector("#mealNote").value = "";
  saveStatus.textContent = wasEditing ? "餐食记录已修改" : "餐食记录已保存";
});

document.querySelector("#addExercise").addEventListener("click", () => {
  const wasEditing = editingHealth?.group === "exercise";
  const type = inputValue("exerciseType");
  const duration = Number(inputValue("exerciseDuration"));
  if (!type || !Number.isFinite(duration) || duration <= 0) {
    saveStatus.textContent = "请填写运动项目和时长";
    return;
  }
  addHealthRecord("exercise", {
    time: inputValue("exerciseTime") || currentTime(),
    type,
    duration: Math.round(duration),
    note: inputValue("exerciseNote")
  });
  document.querySelector("#exerciseType").value = "";
  document.querySelector("#exerciseDuration").value = "";
  document.querySelector("#exerciseNote").value = "";
  saveStatus.textContent = wasEditing ? "运动记录已修改" : "运动记录已保存";
});

document.querySelector("#refreshWorkouts").addEventListener("click", refreshWorkoutPlans);
document.querySelector("#refreshAllTrainingBlocks").addEventListener("click", refreshAllTrainingBlocks);
document.querySelector("#recordFullWorkout").addEventListener("click", () => {
  openExerciseRecord(fullWorkoutRecordText(), fullWorkoutDuration());
});
document.querySelector("#toggleMainWorkoutPicker").addEventListener("click", openMainWorkoutPicker);
mainWorkoutPicker.querySelectorAll("[data-close-workout-picker]").forEach((element) => {
  element.addEventListener("click", () => closeMainWorkoutPicker());
});

trainingBlocks.addEventListener("click", (event) => {
  const button = event.target.closest("[data-refresh-block]");
  if (button) refreshTrainingBlock(button.dataset.refreshBlock);
});

document.querySelector("#toggleCustomWorkout").addEventListener("click", () => {
  openMainWorkoutPicker();
  customWorkoutForm.hidden = false;
  document.querySelector("#customWorkoutName").focus();
});

document.querySelector("#closeCustomWorkout").addEventListener("click", () => {
  customWorkoutForm.hidden = true;
});

customWorkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = inputValue("customWorkoutName");
  const duration = inputValue("customWorkoutDuration") || "30分钟";
  const exercises = inputValue("customWorkoutExercises")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [exerciseName, detail = "按舒适强度完成"] = line.split(/[｜|]/).map((item) => item.trim());
      return [exerciseName, detail];
    });
  if (!name || !exercises.length) {
    document.querySelector("#customWorkoutName").focus();
    return;
  }
  const customWorkout = {
    id: createId(),
    name,
    duration,
    exercises,
    note: inputValue("customWorkoutNote")
  };
  customWorkouts.unshift(customWorkout);
  selectedWorkout = customWorkout;
  saveCustomWorkouts();
  renderTrainingBlocks();
  renderWorkoutPlans();
  customWorkoutForm.reset();
  closeMainWorkoutPicker({ returnFocus: false });
});

workoutPlans.addEventListener("click", (event) => {
  const refreshButton = event.target.closest(".refresh-card-button");
  if (refreshButton) {
    refreshSingleWorkout(Number(refreshButton.dataset.workoutIndex));
    return;
  }
  const selectButton = event.target.closest(".select-workout-button");
  if (selectButton) {
    const workout = selectButton.dataset.customWorkoutId
      ? customWorkouts.find((item) => item.id === selectButton.dataset.customWorkoutId)
      : visibleWorkouts[Number(selectButton.dataset.workoutIndex)];
    if (workout) selectMainWorkout(workout);
    return;
  }
  const removeButton = event.target.closest(".remove-workout");
  if (!removeButton) return;
  if (selectedWorkout.id === removeButton.dataset.workoutId) selectedWorkout = WORKOUT_LIBRARY[0];
  customWorkouts = customWorkouts.filter((workout) => workout.id !== removeButton.dataset.workoutId);
  saveCustomWorkouts();
  renderTrainingBlocks();
  renderWorkoutPlans();
});

sectionNav.addEventListener("click", (event) => {
  const button = event.target.closest(".section-nav-item");
  if (!button) return;
  const section = document.querySelector(`#${button.dataset.sectionTarget}`);
  if (!section) return;
  setActiveSection(button.dataset.sectionTarget);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((items) => {
    const visible = items
      .filter((item) => item.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveSection(visible.target.id);
  }, {
    rootMargin: "-18% 0px -62% 0px",
    threshold: [0.01, 0.15, 0.4]
  });
  document.querySelectorAll(".navigable-section").forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((items, observer) => {
    items.forEach((item) => {
      if (!item.isIntersecting) return;
      item.target.classList.add("is-visible");
      observer.unobserve(item.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
  document.querySelectorAll(".card, .review-card").forEach((section, index) => {
    section.classList.add("reveal-section");
    section.style.setProperty("--reveal-delay", `${Math.min(index * 45, 180)}ms`);
    revealObserver.observe(section);
  });
}

function updateScrollProgress() {
  if (!scrollProgressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
  scrollProgressBar.style.transform = `scaleX(${progress})`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const isStandaloneApp = window.matchMedia("(display-mode: standalone)").matches
  || window.navigator.standalone === true;
const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
document.documentElement.classList.toggle("standalone-app", isStandaloneApp);

if (iosInstallTip && isIOSDevice && !isStandaloneApp
    && localStorage.getItem("little-sunshine-install-tip-dismissed") !== "true") {
  window.setTimeout(() => {
    iosInstallTip.hidden = false;
    requestAnimationFrame(() => iosInstallTip.classList.add("is-visible"));
  }, 1200);
}

dismissInstallTip?.addEventListener("click", () => {
  iosInstallTip.classList.remove("is-visible");
  localStorage.setItem("little-sunshine-install-tip-dismissed", "true");
  window.setTimeout(() => { iosInstallTip.hidden = true; }, 260);
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app remains fully usable online if offline registration is unavailable.
    });
  });
}

document.querySelector("#addWater").addEventListener("click", () => {
  const wasEditing = editingHealth?.group === "water";
  const amount = Number(inputValue("waterAmount"));
  if (!Number.isFinite(amount) || amount <= 0) {
    saveStatus.textContent = "请填写有效的饮水量";
    return;
  }
  addHealthRecord("water", {
    time: inputValue("waterTime") || currentTime(),
    amount: Math.round(amount),
    note: inputValue("waterNote")
  });
  document.querySelector("#waterNote").value = "";
  saveStatus.textContent = wasEditing ? "饮水记录已修改" : "饮水记录已保存";
});

document.querySelector(".range-switch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-range]");
  if (!button) return;
  trendRange = Number(button.dataset.range);
  document.querySelectorAll(".range-switch button").forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  renderGlucoseChart();
  renderPatterns();
});

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const reminderInputIds = [
  "breakfastReminder", "lunchReminder", "dinnerReminder", "exerciseReminder", "waterReminder"
];

function loadReminderSettings() {
  reminderInputIds.forEach((id) => {
    if (reminderSettings[id] !== undefined) document.querySelector(`#${id}`).value = reminderSettings[id];
  });
  updateReminderStatus();
}

function saveReminderSettings() {
  reminderInputIds.forEach((id) => {
    reminderSettings[id] = document.querySelector(`#${id}`).value;
  });
  localStorage.setItem(REMINDER_KEY, JSON.stringify(reminderSettings));
  updateReminderStatus();
}

function updateReminderStatus(message = "") {
  if (message) {
    reminderStatus.textContent = message;
    return;
  }
  if (!("Notification" in window)) {
    reminderStatus.textContent = "当前浏览器不支持桌面通知，时间设置仍会保留。";
  } else if (Notification.permission === "granted") {
    reminderStatus.textContent = "提醒已开启。网页打开时会按设定时间通知。";
  } else if (Notification.permission === "denied") {
    reminderStatus.textContent = "通知已被浏览器阻止，可在浏览器设置中重新允许。";
  } else {
    reminderStatus.textContent = "点击“开启通知”后生效；提醒仅在网页打开时运行。";
  }
}

document.querySelector("#enableNotifications").addEventListener("click", async () => {
  if (!("Notification" in window)) {
    updateReminderStatus();
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    reminderSettings.enabled = permission === "granted";
    localStorage.setItem(REMINDER_KEY, JSON.stringify(reminderSettings));
    updateReminderStatus(permission === "granted" ? "提醒已开启。请保持网页打开。" : "尚未获得通知权限。");
  } catch (error) {
    updateReminderStatus("当前打开方式无法启用通知；部署为在线网站后可正常申请权限。");
  }
});

reminderInputIds.forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("change", saveReminderSettings);
});

function sendReminder(title, body, key) {
  if (!reminderSettings.enabled || !("Notification" in window) || Notification.permission !== "granted") return;
  if (lastReminderKey === key) return;
  lastReminderKey = key;
  new Notification(title, { body, tag: key });
}

function checkReminders() {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  const day = dateKey(now);
  const fixed = [
    ["breakfastReminder", "早餐时间到了", "记得按自己的计划吃早餐，并按需记录餐食。"],
    ["lunchReminder", "午餐时间到了", "慢慢吃，餐后可记录食物与血糖变化。"],
    ["dinnerReminder", "晚餐时间到了", "记下今天的晚餐，方便之后复盘。"],
    ["exerciseReminder", "该活动一下了", "选择适合自己的运动强度，注意身体感受。"]
  ];
  fixed.forEach(([id, title, body]) => {
    if (reminderSettings[id] === time) sendReminder(title, body, `${day}-${id}-${time}`);
  });

  const interval = Number(reminderSettings.waterReminder || 0);
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (interval > 0 && minutes >= 8 * 60 && minutes <= 22 * 60 && minutes % interval === 0) {
    sendReminder("喝水时间", "适量补充水分，也可以顺手记录饮水量。", `${day}-water-${time}`);
  }
}

document.querySelector("#saveOrganizer").addEventListener("click", () => {
  selectedPlan = dayPlanInput.value.trim();
  selectedPlanPriority = dayPlanPriority.value;
  const birthdayKey = recurringDateKey(selectedDate);
  const name = birthdayName.value.trim();
  const note = birthdayNote.value.trim();
  if (name) birthdayMemos[birthdayKey] = { name, note };
  else delete birthdayMemos[birthdayKey];
  saveBirthdays();
  autoSave();
  renderCalendarInfo();
  saveStatus.textContent = "日计划与生日备忘已保存";
});

document.querySelector("#deleteEntry").addEventListener("click", openClearModal);

document.querySelector("#confirmClearEntry").addEventListener("click", () => {
  const key = dateKey(selectedDate);
  delete entries[key];
  saveEntries();
  loadEntry();
  renderCalendar();
  closeClearModal();
  saveStatus.textContent = "这一天的记录已清空";
});

clearModal.querySelectorAll("[data-close-clear]").forEach((element) => {
  element.addEventListener("click", closeClearModal);
});

document.querySelector("#openWeatherSettings").addEventListener("click", openWeatherSettings);
weatherRefresh.addEventListener("click", loadWeather);

document.querySelector("#weatherSettingsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = weatherCityInput.value.trim();
  if (!city) {
    weatherSettingsStatus.textContent = "请填写城市名称。";
    weatherCityInput.focus();
    return;
  }
  weatherSettingsStatus.textContent = "正在查找城市……";
  try {
    weatherSettings = await findWeatherCity(city);
    localStorage.setItem(WEATHER_KEY, JSON.stringify(weatherSettings));
    closeWeatherSettings();
    await loadWeather();
  } catch (error) {
    weatherSettingsStatus.textContent = "没有找到这个城市，请尝试输入完整城市名，如“上海”或“成都市”。";
  }
});

weatherSettingsModal.querySelectorAll("[data-close-weather-settings]").forEach((element) => {
  element.addEventListener("click", closeWeatherSettings);
});

recordModal.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeRecord);
});

document.querySelector("#editRecord").addEventListener("click", () => {
  closeRecord();
  animateEntryPanel();
});

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target === lightboxContent) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (lightbox.classList.contains("is-open")) closeLightbox();
  else if (clearModal.classList.contains("is-open")) closeClearModal();
  else if (weatherSettingsModal.classList.contains("is-open")) closeWeatherSettings();
  else if (mainWorkoutPicker.classList.contains("is-open")) closeMainWorkoutPicker();
  else if (recordModal.classList.contains("is-open")) closeRecord();
});

["glucoseTime", "mealTime", "exerciseTime", "waterTime"].forEach((id) => {
  document.querySelector(`#${id}`).value = currentTime();
});
document.querySelectorAll(".health-tab").forEach((tab) => {
  tab.setAttribute("aria-selected", String(tab.classList.contains("active")));
});
document.querySelectorAll(".range-switch button").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
});
setActiveSection("calendarSection");
setEntryMode("home");
setHealthTab("glucose");
refreshAllTrainingBlocks();
refreshWorkoutPlans();
loadReminderSettings();
checkReminders();
window.setInterval(checkReminders, 30000);
loadWeather();
loadEntry();
renderCalendar();
window.addEventListener("resize", syncEntryPanelHeight);
if ("ResizeObserver" in window) {
  new ResizeObserver(syncEntryPanelHeight).observe(calendarPanel);
}
