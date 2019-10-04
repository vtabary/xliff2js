export interface IXliffTag {
  name: string;
  $: { [key:string]: string };
  children: (string | IXliffTag)[];
}
