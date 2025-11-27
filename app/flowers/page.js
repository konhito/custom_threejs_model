import FlowersPageContent from "../../components/page-content/FlowersPageContent";
import { flowersPageContent } from "../../content/flowersPageContent";

export default function FlowersPage() {
  return <FlowersPageContent content={flowersPageContent.en} />;
}
