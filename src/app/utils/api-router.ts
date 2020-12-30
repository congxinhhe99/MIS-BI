export const authenticationRouter = {
  getToken: `api/v1/authentication/jwt/login`,
};

export const navigationRouter = {
  getNavigationOwner: `api/v1/bsd/navigations/owner`,
};
export const nodeUploadRouter = {
  uploadFileBlobPhysical: `api/v1/core/nodes/upload/physical/blob`,
};

export const userRouter = {
  getListRightOfUser: `api/v1/idm/users`,
  getListRoleOfUser: `api/v1/idm/users`,
};

export const provinceRouter = {
  create: `api/v1/res/province`,
  createMany: `api/v1/res/province/create-many`,
  getFilter: `api/v1/res/province/filter`,
  getAll: `api/v1/res/province/all`,
  update: `api/v1/res/province`,
  getById: `api/v1/res/province?id=`,
  delete: `api/v1/res/province`,
  getListCombobox: `api/v1/res/province/for-combobox`,
};

export const districtRouter = {
  create: `api/v1/res/district`,
  createMany: `api/v1/res/district/create-many`,
  update: `api/v1/res/district`,
  delete: `api/v1/res/district`,
  getById: `api/v1/res/district?id=`,
  getFilter: `api/v1/res/district/filter`,
  getAll: `api/v1/res/district/all`,
  getListCombobox: `api/v1/res/district/for-combobox`,
};

export const communeRouter = {
  create: `api/v1/res/commune`,
  createMany: `api/v1/res/commune/create-many`,
  update: `api/v1/res/commune`,
  delete: `api/v1/res/commune`,
  getById: `api/v1/res/commune?id=`,
  getFilter: `api/v1/res/commune/filter`,
  getAll: `api/v1/res/commune/all`,
  getListCombobox: `api/v1/res/commune/for-combobox`,
};

export const organizationRouter = {
  create: `api/v1/cms/organization-v2`,
  createMany: `api/v1/cms/organization-v2/create-many`,
  update: `api/v1/cms/organization-v2`,
  delete: `api/v1/cms/organization-v2`,
  getById: `api/v1/cms/organization-v2?id=`,
  getFilter: `api/v1/cms/organization-v2/filter`,
  getAll: `api/v1/cms/organization-v2/all`,
  getListCombobox: `api/v1/cms/organization-v2/for-combobox`,
};

export const areaOperationRouter = {
  create: `api/v1/res/area-operation`,
  createMany: `api/v1/res/area-operation/create-many`,
  update: `api/v1/res/area-operation`,
  delete: `api/v1/res/area-operation`,
  getById: `api/v1/res/area-operation?id=`,
  getFilter: `api/v1/res/area-operation/filter`,
  getAll: `api/v1/res/area-operation/all`,
  getListCombobox: `api/v1/res/area-operation/for-combobox`,
};
