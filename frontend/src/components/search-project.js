import { Button, Input } from "antd";

const { Search } = Input;

export const SearchProject = ({}) => {
  const onSearch = (value) => {
    //TODO: use value as keyword to search projects, then redirect to projects page to display all matched projects
  };

  const handleClickCreateProject = () => {
    window.location.href = "/create-project";
  };

  return (
    <div>
      <Search
        placeholder="Search projects"
        onSearch={onSearch}
        enterButton
        style={{ width: "50%", marginTop: "30vh" }}
      />
      <div style={{ marginTop: "10vh" }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={handleClickCreateProject}
        >
          Create New Project
        </Button>
      </div>
    </div>
  );
};
