/// <reference types="vite/client" />

declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";

declare module "@/store/*";
declare module "@/views/*";
declare module "@/constant/*";
declare module "@/design/*";
declare module "@/components/*";
declare module "@/utils/*";
declare module "@/const/*";

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
