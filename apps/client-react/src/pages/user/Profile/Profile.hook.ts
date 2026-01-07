import { AuthContext } from "../../../context";
import { UserQueriesKeysEnum } from "../../../enum/enum";
import { getUserById } from "../../../services/user.service";
import { AuthContextType } from "../../../types/user/auth.context.type";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export function ProfileHook() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useContext(AuthContext) as AuthContextType;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: [UserQueriesKeysEnum.GET_USER_BY_ID, userId],
    queryFn: () => {
      if (!userId) throw new Error("ID utilisateur requis.");
      return getUserById(userId);
    },
    enabled: Boolean(userId),
  });

  return {
    user,
    isLoading,
    error,
    currentUser,
  };
}
