import { isUserApproverType, userConverse } from "./user";
import {getDIByUniqueId, getEntityByRoleId} from '../service/KartoffelService';

export const transformNode = (node) => {
  return {
    label: node.label,
    expanded: true,
    children: !node.children ? [] : node.children.map((child) => transformNode(child)),
  };
};

export const canEditHierarchy = (user) => {
  return isUserApproverType(user);
};

export const getHierarchy = (hierarchy) => {
  const splitHierarchy = hierarchy.split("/");
  const hierarchyReadOnly = splitHierarchy.slice(0, splitHierarchy.length - 1).join("/");
  const hierarchyName = splitHierarchy[splitHierarchy.length - 1];

  return { hierarchyReadOnly, hierarchyName };
};

export const concatHierarchy = (hierarchy) => {
  return hierarchy[1] != undefined ? `${hierarchy[0]}/${hierarchy[1]}` : hierarchy[0];
};

export const hierarchyConverse = (hierarchy)  => {
    if (hierarchy?.name) {
      return hierarchy?.hierarchy ? `${hierarchy.hierarchy}/${hierarchy.name}` : hierarchy.name;
    }
    return undefined;
}

export const hierarchyItemTemplate = (item) => {
  return (
    <>
      {item.hierarchy != "" && item.hierarchy + "/"}
      {item.name}
    </>
  );
};

export const getOuDisplayName = (hierarchy, name, withName = true) => {
  let ouDisplayName = withName? `${hierarchy}/${name}`: hierarchy;
  ouDisplayName = ouDisplayName.split('/');
  ouDisplayName.shift();
  ouDisplayName = ouDisplayName.join("/");
  return ouDisplayName;
}

export const processHierarchyData = async(hierarchy) => {
  const hierarchyName = hierarchyConverse(hierarchy);
  return await Promise.all(hierarchy.directRoles.map(async(role) => {
    let newRow = {};

    newRow["היררכיה"] = hierarchyName;
    newRow["שם תפקיד"] = role.jobTitle;
    newRow["מזהה תפקיד"] = role.roleId;

    try {
      const di = await getDIByUniqueId(role.digitalIdentityUniqueId);
      newRow["מזהה כרטיס"] = di?.upn? di.upn: "---";
      
    } catch (error) {
      console.log(error)
      newRow["מזהה כרטיס"] = "לא ידוע"
    }

    try {
      const entity = await getEntityByRoleId(role.roleId);
      newRow["משתמש בתפקיד"] = userConverse(entity);
    } catch (error) {
      newRow["משתמש בתפקיד"] = "לא ידוע"
    }
    
    return newRow;
  }));
};