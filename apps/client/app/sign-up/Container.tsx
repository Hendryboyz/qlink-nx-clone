import Title from '../../components/Title';
import StepIndicator from "./StepIndicator"

type Props = {
  title: string;
  step: number;
  bottomEle?: React.ReactNode,
  children?: React.ReactNode
};

const Container = ({ title, step, bottomEle, children }: Props) => {
  return (
    <div className="w-full py-16 px-12 flex flex-col h-full flex-1 gap-16">
      <Title className='text-left w-33 pr-16 text-primary'>{title}</Title>
      <StepIndicator steps={[1,2,3]} currentStep={step} />
      {children}
      {bottomEle ? <div className="mt-auto">{bottomEle}</div> : null}
    </div>
  );
};

export default Container;
