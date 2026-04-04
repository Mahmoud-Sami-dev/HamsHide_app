const generateMessage = (entity) => {
  return {
    alreadyExist: `${entity} already exists`,
    notFound: `${entity} not found`,
    created: `${entity} created successfully`,
    updated: `${entity} updated successfully`,
    deleted: `${entity} deleted successfully`,
    failToCreate: `fail to create ${entity}`,
    failToUpdate: `fail to Update ${entity}`,
    failToDelete: `fail to Delete ${entity}`,
  };
};
export const SYS_MESSAGE = {
  user: generateMessage("User"),
  message: generateMessage("message"),
};
