// 时间戳
import formatTime from "./format-time.js";
// 这里可以导入多个其他的自定义指令事件...

// 导出公共自定义指令出口
export default function totalDirectives(app) {
  // app: 全局指令
  formatTime(app);
}
