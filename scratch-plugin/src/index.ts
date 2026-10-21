import type { Context } from '@deepseek-ai/cordis';
import * as greetTool from './my-plugin.js';

// 1. 导出插件的唯一标识名称（用于日志追踪与依赖路由）
export const name = 'my-performance-monitor';

// 2. 核心入口 apply 函数：微内核加载插件时会自动调用
export function apply(ctx: Context) {
  console.log('[my-performance-monitor] ✅ 插件成功挂载到 DeepSeek Harness 运行时！');

  // ===== 挂载其他子插件 =====
  // ctx.plugin() 会把 greetTool 作为独立插件装载进内核，
  // 它的 inject = ['tools'] 依赖声明也会被正确处理
  ctx.plugin(greetTool);

  console.log('吃了吗吃了吗？？？？!!')

  // 监听 fiber 生命周期变化（cordis 4.0.5 提供的内置事件）
  ctx.on('internal/status', (fiber, oldValue) => {
    console.log(`[my-performance-monitor] fiber ${fiber.uid} 状态: ${oldValue} -> ${fiber.state}`);
  });

  // 定时心跳自检
  // 注意：教程中的 ctx.setInterval 在 cordis 4.0.5 中不存在，
  // 这里使用原生 setInterval。cordis 4.0.5 的自动清理 API（fiber.effect）
  // 挂在 Fiber 对象上，入门示例中暂不涉及。
  setInterval(() => {
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`[my-performance-monitor] 智能体进程堆内存占用: ${memUsage.toFixed(2)} MB`);
  }, 30000);
}
