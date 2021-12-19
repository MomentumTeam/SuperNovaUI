export const canEditRole = (selectedEntity, user) => {
  // return selectedEntity && selectedEntity.id === user.id;
  return true;
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

