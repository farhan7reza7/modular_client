import { useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();

  return <div className="component">User {id} page</div>;
};

export default User;
