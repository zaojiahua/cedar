// noinspection JSUnresolvedVariable
export default {
    "DEBUG": false,
    "REEF_HOST": ip.REEF_HOST,
    "REEF_PORT": "8000",
    "CORAL_HOST": ip.CORAL_HOST,
    "INDOOR_HOST": ip.INDOOR_HOST,
    "UPDATE_HOST": ip.UPDATE_HOST,
    "ADMIN_PORT":"10803",
    "CONFIG_PORT":"10808",
    "DEVINDOOR_PORT":"10802",
    "CREATETBOARD_PORT":"10811",
    "JOBSVC_PORT":"10801",
    "WEBSOCKET":"8002",
    // Paging setting
    "DEFAULT_PAGE_SIZE": 10,
    "LARGE_PAGE_SIZE": 500
}

/*
ip配置儅不包含在代碼中, 每個部署版本需自行建置, 格式如下:
PATH: {{PROJECT_ROOT}}/public/ip.js

let ip = {
    KEY_NAME: VALUE,
    KEY_NAME: VALUE,
    KEY_NAME: VALUE
}

如:

let ip = {
    "REEF_HOST": "10.80.3.138",
    "CORAL_HOST":"10.80.3.100",
    "INDOOR_HOST":"10.80.3.138",
}
*/



