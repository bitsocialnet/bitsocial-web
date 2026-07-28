import Premise from "./Premise";
import SettlementLayer from "./SettlementLayer";
import ValueAccrual from "./ValueAccrual";
import ProgrammableRevenue from "./ProgrammableRevenue";
import SoundMoney from "./SoundMoney";
import ImmutableUpgrade from "./ImmutableUpgrade";
import BsoNames from "./BsoNames";
import Endgame from "./Endgame";
import MasterPlan from "./MasterPlan";
import GetBso from "./GetBso";

export default function Sections() {
  return (
    <>
      <Premise />
      <SettlementLayer />
      <ValueAccrual />
      <ProgrammableRevenue />
      <SoundMoney />
      <ImmutableUpgrade />
      <BsoNames />
      <Endgame />
      <MasterPlan />
      <GetBso />
    </>
  );
}
