export function getWeekNumberOfTerm(startDate) {
  // 获取学期开始和结束日期是星期几
  let startWeekOfTerm = new Date(startDate).getDay();

  // 获取当前日期
  let today = new Date();

  // 计算从学期开始日期到今天经过了多少天
  let daysElapsed = Math.floor(
    (today - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  // 计算今天是本学期的第几周，假设每周从周日开始，到周六结束
  let weekNumber = Math.ceil((daysElapsed + startWeekOfTerm - 1) / 7);

  return weekNumber;
}
