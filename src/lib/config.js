import ip from "./ip"
export default {
    "DEBUG": true,
    "REEF_HOST": ip.REEF_HOST,
    "REEF_PORT": "8000",
    "CORAL_HOST": ip.CORAL_HOST,
    "INDOOR_HOST": ip.INDOOR_HOST,
    "ADMIN_PORT":"10803",
    "CONFIG_PORT":"10808",
    "DEVINDOOR_PORT":"10802",
    "CREATETBOARD_PORT":"10811",
    "JOBSVC_PORT":"10801",
    // Paging setting
    "PAGE_SIZE": 5,
    "LARGE_PAGE_SIZE": 50
}

/*
ip配置儅不包含在代碼中, 每個部署版本需自行建置, 格式如下:
PATH: ./src/lib/ip.js

export default {
    KEY_NAME: VALUE,
    KEY_NAME: VALUE,
    KEY_NAME: VALUE
}

如:

export default{
    "REEF_HOST": "127.0.0.1",
    "CORAL_HOST":"10.80.3.100",
    "INDOOR_HOST":"10.80.3.138",
}
*/



