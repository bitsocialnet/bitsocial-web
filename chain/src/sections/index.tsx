import SettlementLayer from "./SettlementLayer";
import ValueAccrual from "./ValueAccrual";
import ProgrammableRevenue from "./ProgrammableRevenue";
import SoundMoney from "./SoundMoney";
import ImmutableUpgrade from "./ImmutableUpgrade";
import Endgame from "./Endgame";
import MasterPlan from "./MasterPlan";
import GetBso from "./GetBso";

export default function Sections() {
  return (
    <>
      <SettlementLayer />
      <ValueAccrual />
      <ProgrammableRevenue />
      <SoundMoney />
      <ImmutableUpgrade />
      <Endgame />
      <MasterPlan />
      <GetBso />
    </>
  );
}
