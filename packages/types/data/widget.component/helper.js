// @flow

type Props = {
  n: number,
};

export default async function(props: Props): Promise<number> {
  return Math.floor(Math.random() * props.n);
}
