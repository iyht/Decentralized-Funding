import { Card, Avatar } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

export const ProjectCard = ({ project }) => {
  return (
    <Card
      style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src={project[img_url]}
        />
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={project[title]}
        description={project[description]}
      />
    </Card>
  );
};
