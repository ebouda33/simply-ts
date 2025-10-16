export type ClassDecoratorFactory<TOptions = any> = (
  options?: TOptions,
) => <T extends new (...args: any[]) => {}>(constructor: T) => any;
