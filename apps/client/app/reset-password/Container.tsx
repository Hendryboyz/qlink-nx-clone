import Title from '../../components/Title';

type Props = {
  title: string;
  bottomEle?: React.ReactNode;
  children?: React.ReactNode;
};

const Container = ({ title, bottomEle, children }: Props) => {
  return (
    <div className="w-full py-16 px-12 flex flex-col h-full flex-1 gap-16">
        <Title className="text-left w-10 text-[#FFF0D3]">
          {title}
        </Title>
      <div className="h-13"></div>
      <div className="h-[0px]"></div>
      {children}
      {bottomEle ? <div className="mt-auto">{bottomEle}</div> : null}
    </div>
  );
};

export default Container;
