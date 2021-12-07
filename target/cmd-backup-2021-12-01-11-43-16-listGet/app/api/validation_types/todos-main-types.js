/* eslint-disable */

const initDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri(),
  name: uu5String(512),
  sysState: oneOf(["active", "restricted", "readOnly"]),
  adviceNote: shape({
    message: uu5String().isRequired(),
    severity: oneOf(["debug", "info", "warning", "error", "fatal"]),
    estimatedEndTime: datetime(),
  }),
});

const sysUuAppWorkspaceInitDtoInType = shape({
  code: code().isRequired(),
  name: string(100).isRequired(),
  description: uu5String(4000),
  uuAppProfileAuthorities: uri().isRequired()
})
