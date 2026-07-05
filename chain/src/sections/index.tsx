import SoundMoney from "./SoundMoney";
import SettlementLayer from "./SettlementLayer";
import ValueAccrual from "./ValueAccrual";
import ProgrammableRevenue from "./ProgrammableRevenue";
import ImmutableUpgrade from "./ImmutableUpgrade";
import Endgame from "./Endgame";
import MasterPlan from "./MasterPlan";
import GetBso from "./GetBso";

export default function Sections() {
  return (
    <>
      <SoundMoney />
      <SettlementLayer />
      <ValueAccrual />
      <ProgrammableRevenue />
      <ImmutableUpgrade />
      <Endgame />
      <MasterPlan />
      <GetBso />
    </>
  );
}
