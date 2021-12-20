export const canEditRole = (selectedEntity, user) => {
  const role = selectedEntity && user.digitalIdentities.find((di) => di.role.roleId === selectedEntity.roleId);

  return role;
};

export const roleItemTemplate = (item) => {
//   const getRole = () => {
//     if (item?.hierarchy && item?.jobTitle && item.jobTitle != "" && item.jobTitle != "unknown") {
//       return `${ item.jobTitle + "/" + item?.hierarchy}`
//     } else {
//       return `${ item.roleId}`
// 
//     }
//   }

  const getRole = () => {return item.roleId};
  return (
    <>
    {getRole()}
    </>
  );
};

