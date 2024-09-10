// 导入时间戳工具dayjs
import dayjs from "dayjs";

export default function (app) {

    // 创建自定义指令：format-time
    app.directive("format-time", {
        mounted(el, bindings) {
            // el.textContent：获取到el数据上下文
            const textContent = el.textContent;

            // 转化成数字类型
            let timeNumber = parseInt(textContent);

            // 数字类型无法直接通过length获取长度
            // 如果长度是10那就是秒数
            if (textContent.length == 10) {
                // 统一使用豪秒数来处理时间戳，秒数：10位，毫秒13位
                timeNumber = timeNumber * 1000;
            }

            // 默认解析格式
            let formatString = "YYYY-MM-DD HH:mm:ss";
            // 如果传递进来修饰符，根据传递进来的修饰符进行转化：format-time="'YYYY/MM/DD'"
            if (bindings.value) {
                formatString = bindings.value;
            }

            // 使用dayjs插件对时间戳进行转化
            el.textContent = dayjs(timeNumber).format(formatString);
        },
    });
}
