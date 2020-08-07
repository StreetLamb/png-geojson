// import ReactJson from "react-json-view";
import dynamic from "next/dynamic";
import { Card } from "antd";

export default function ResultCard({ result }) {
  const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });
  return (
    <div>
      <Card title="GeoJson Result" bodyStyle={{ overflowY: "scroll" }}>
        <DynamicReactJson
          src={result}
          style={{ width: "80vw", height: "30rem" }} //36rem
        />
      </Card>
    </div>
  );
}
