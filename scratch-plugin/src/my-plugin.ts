import type { Context } from '@deepseek-ai/cordis';
import { defineTool } from '@deepseek-ai/dsh-tools';

// 1. 插件唯一标识名称
export const name = 'greet-tool';

// 2. 声明依赖 tools 服务（Cordis 会等待工具总线初始化完成后再执行 apply）
export const inject = ['tools'];

export function apply(ctx: Context) {
  // 3. 将 defineTool 实例注册到 Harness 工具注册表中
  ctx.tools.register(defineTool({
    // 工具唯一名称（模型 Tool Calling 匹配的函数名）
    name: 'greet',

    // 工具语义描述（向模型清晰解释此工具的用途与调用时机）
    description: '根据传入的人名生成友好的问候语句。',

    // 入参声明：定义参数类型、是否必填以及字段说明
    parameters: {
      name: {
        type: 'string',
        required: true,
        description: '被问候者的名字或昵称（如 "Ada"、"Alice"）'
      },
      language: {
        type: 'string',
        // 省略 required 即为非必填（本版本 API 不接受 required: false）
        description: '问候语言类型，可选 "zh" 或 "en"，默认为 "zh"'
      }
    },

    // 输出定义与模型视图渲染
    output: {
      schema: { type: 'string' },
      // render 函数将 execute 返回的结果包装为消息文本发送给模型
      render: (_args, value) => [{ type: 'text', text: value }]
    },

    // 核心执行逻辑
    async execute(args) {
      const lang = args.language || 'zh';
      if (lang === 'en') {
        return `Hello, ${args.name}! Welcome to DeepSeek Harness.`;
      }
      return `你好，${args.name}！欢迎使用 DeepSeek Harness 智能体。`;
    }
  }));
}
