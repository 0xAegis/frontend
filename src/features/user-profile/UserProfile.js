import { useParams } from "react-router-dom";

export const UserProfile = () => {
  let params = useParams();
  return "user profile of: " + params.username;
};
