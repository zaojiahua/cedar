export default {
    public:{
        error_500:"服务器错误!",
        btn_close:"关闭",
        btn_ok:"确认",
        btn_cancel:"取消",
        btn_add:"添加",
        btn_del:"删除",
        btn_save:"保存",
        modal_info:"提示",
        modal_warn:"警告",
        requestSuccess:"请求成功",
        requestFail:"请求失败",
        delSuccess:"删除成功",
        delFail:"删除失败",
        addSuccess:"添加成功",
        addFail:"添加失败",
        del_list:"批量删除",
        cancelSelect:"取消选择",
        moreAction:"更多操作",
        loadFail:"载入失败",
        noData:"暂无数据",
        btn_back:"返回",
        btn_next:"下一步",
        btn_prev:"上一步",
    },
    login:{
        remember:"保持登入",
        login_btn:"登入",
        check_username:"请输入用户名!",
        check_password:"请输入密码!",
        successMsg:"成功登入!",
        errorMsg_400:"该用户已被冻结!",
        errorMsg_401:"密码错误!",
        errorMsg_404:"用户名错误!",
    },
    navbar:{
        setting:{
            name:"设置",
            TGuard:"T-Guard干扰词库",
            page:"页面设置",
            about:"关于TMach"
        },
        loginOut:"登出",
        user:"用户管理",
        sys:"系统升级",
        job:"用例管理",
        testSet:"测试集",
        create:"新建任务",
        tboard:"我的任务",
        rds:"测试数据",
        perf:"性能分析",
        device:"设备管理",
        clean:"清理中心",
        abnormal:"异常统计",
        reef:"Reef版本",
        cedar:"Cedar版本",
        loginOutTit:"您确定要登出?",
        loginOutSuccess:"登出成功!"
    },
    personal:{
        title:"个人基本资料展示",
        name:"用户名",
        real:"真实姓名",
        role:"权限",
        psd:"新密码",
        btn_update:"修改密码",
        btn_save:"保存修改",
        enterPassword:"请输入密码!",
        successPsd:"密码修改成功!",
        errorPsd:"密码修改失败!",
    },
    TGuard:{
        addTit:"请添加新干扰词",
        getError:"TGuard词组获取失败",
        delTit:"确认要删除干扰词： ",
        delSuccess:"删除成功 ",
        delError:"删除失败 ",
        addWaring:"请输入要添加的干扰词!",
        addSuccess:"添加成功",
        addErr_1:"干扰词已存在",
        addErr_2:"添加失败",
        addErr_3:"下发失败",
    },
    pageSetting:{
        pageSize:"分页数据页面笔数设置",
        sige_1:"10 条/页",
        sige_2:"30 条/页",
        sige_3:"50 条/页",
        sige_4:"100 条/页",
        language:"语言设置",
        sucTip:"操作成功！"
    },
    usage:{
        use:"已使用",
        clean:"正在清理中...",
        fail:"清理失败...",
        abnormal:"清理异常...",
        dateTit:"选择要清理的日期范围",
        btn_clean:"清理",
        capacityFail:"取得容量信息失败",
        socketConnectError:"socket连接中断，请联系管理员处理",
        noRepeat:"正在清理,请勿重复点击...",
        cleanAbn:"清理服务异常，请联系管理员处理",
        selectDate:"请选择要清理的时间范围",
        modalContent:"清理会影响正常使用TMach和Edtior，可能需要较长时间，确定要清理吗?",
        star:"开始清理",
        modalContent_2:"最多只能选取15天的数据，已自动调整日期！",
        noSocket:"您的浏览器不支持socket",
    },
    userManagement:{
        add:"添加用户",
        info:"用户信息",
        userColumns:{
            username:"用户名",
            firstname:"真实姓名",
            role:"角色",
            job_amount:"编辑用例数量",
            job_contribution:"贡献总分",
            action:"操作",
            btn_1:"修改",
            btn_2:"冻结账户",
            btn_3:"解冻账户",
        },
        modalContent: "您确定要删除这些数据吗?",
        modalContent_2: "请选择要删除的数据",
        waringTit:"不能对该账户进行此操作!",
        content:"您确定要冻结该账户吗?",
        successMsg:"冻结账户成功!",
        errorMsg:"冻结账户失败!",
        content_1:"您确定要恢复该账户吗?",
        successMsg_1:"解冻账户成功!",
        errorMsg_1:"解冻账户失败!",
    },
    userDetail:{
        username:"登录名：",
        firstname:"真实姓名：",
        password:"密码：",
        role:"角色：",
        btn_1:"修改密码",
        errorMsg_1:"获取权限列表失败！",//Failed to get permission list.
        success_1:"修改成功",
        error_2:"该用户名已存在，请重新输入！",
        verify_1:"登录名不能为空！",
        verify_2:"登录名的长度应在5-50个字符之内！",
        verify_3:"请输入正确的邮箱格式！",
        verify_4:"密码不能为空！",
        verify_5:"密码长度应在6-30个字符之内！",
        verify_6:"请选择该用户拥有的权限（至少选择一项）！",
    },
    filter:{
        case:"用例",
        word:"字母",
        clean:"清空",
        phone_model:"适用机型",
        job_test_area:"测试用途",
        android_version:"安卓版本",
        rom_version:"ROM版本",
        reefuser:"维护人员",
        custom_tag:"自定义标签",
        type:"测试柜类型",
        fail:"载入失败",
    },
    jobList:{
        job_name:"用例名称",
        job_type:"用例类型",
        Joblib:"功能",
        PerfJob:"性能",
        InnerJob:"内嵌",
        display_job_test_area:"测试用途",
        display_custom_tag:"自定义标签",
        username:"维护人员",
        updated_time:"更新时间",
        counter:"运行次数",
        delete:"删除",
    },
    jobManagement:{
        import:"导入用例",
        export:"导出用例",
        change:"变更归属账号",
        select:"请选择目标账号",
        delTit:"存在关联用例，无法删除，继续删除选中的其他用例吗？",
        continue:"继续",
        importTit: "导入以下用例将覆盖系统中已有的用例，请选择仍要继续导入的用例",
        import_btn:"导入",
        contrast:"状态",
        new:"较新",
        old:"较旧",
        have:"已有用例",
        delSelect:"请选择要删除的数据！",
        delSure:"您确定要删除这些用例吗?",
        delSuccess:"用例删除成功！",
        delFail:"用例删除失败！",
        uploadSuccess:"文件上传成功！",
        selJob:"请选择要导出的用例！",
        exportTit_1:"您确定要导出这些用例吗?",
        exportTit_2:"普通用户只能导出自己的用例，管理员可以导出全部用例。",
        isExport:"正在导出用例...",
        exportFail:"导出用例失败!",
        selJob_2:"请先选择用例！",
        userError:"获取目标用户失败",
        selUser:"请先选择用例归属目标！",
        changeSuccess:"用例变更归属成功",
        changeFail:"变更归属账号失败！ ",
        userFail:"获取用户权限信息失败"
    },
    jobDetail:{
        cardTit:"用例详细信息",
        description:"用例说明",
        resource:"附加资源",
        noResource:"暂无资源",
        process_time:"平均时长",
        max_process_time:"最大时长",
        del:"删除用例",
        host:"主机",
        noData:"暂无数据",
        loadFail:"数据加载失败",
        delTit:"您确定要删除该用例吗？",
        delSuccess:"用例删除成功",
        err_1:"job不存在",
        err_2:"该inner job关联了其他用例，无法完成删除操作",
        err_3:"用例删除失败！",
        err_4:"存在关联用例，无法删除！！",
        fail:"获取app列表失败"
    },
    innerJobTable:{
        number:"序号",
        connect:"关联用例",
        error:"inner关联信息获取失败",
    },
    testSetList:{
        test:"测试集",
        addJob:"添加用例",
        remove:"批量移除",
        export:"导出用例",
        name:"测试集名称",
        job_count:"用例数量",
        cabinet_version_list:"涉及测试柜",
        duration_time:"预计耗时",
        update_time:"更新时间",
        action:"操作",
        see:"查看用例",
        house:" 小时",
        err:"测试集信息获取失败",
        selTit:"请选择用例！",
        addSuccess:"用例添加成功",
        addFailed:"用例添加失败",
        selTit_2:"至少选择一个用例！",
        removeTit:"确认移除选中的用例吗?",
        delSuccess:"用例移除成功",
        delFailed:"用例移除失败",
    },
    testSetManagement:{
        topTit:"项目列表",
        newPro:"新建项目",
        enterName:"输入项目名称",
        allTestSet:"全部测试集",
        testSetList:"测试集列表",
        sel:"已选",
        units:"个",
        newTestSet:"新建测试集",
        add:"添加测试集",
        copy:"复制",
        move:"移动",
        remove:"从当前项目移除",
        del:"删除",
        enterName_2:"输入测试集名称",
        reName:"重命名",
        addTo:"添加测试集到",
        pro:"项目",
        remove_2:"移动/复制到",
        proWarn_1:"项目名称不能为空！",
        proWarn_2:"项目名称不能超过20个字符！",
        addProSuccess:"项目添加成功",
        proWarn_3:"项目不允许重名",
        reNameSuccess:"重命名成功",
        sureDel:"是否要删除",
        delSuccess:"项目删除成功",
        delTit:"非admin不允许删除测试集",
        delOne:"至少选择一项！",
        delTit_2:"确定要删除这些测试集吗?",
        delSuccess_2:"测试集删除成功!",
        delFail_2:"测试集删除失败，请刷新页面重试！",
        copyTit:"至少有两个项目，才可以进行复制移动操作！",
        operateSuccess_1:"操作成功，目标项目增加了",
        operateSuccess_2:"个测试集",
        removeTit:"确定从当前项目中移除这些测试集吗？",
        removeSuccess:"移除成功",
        getFailed:"用例名称获取失败",
        addSuccess:"成功添加"
    },
    filterSwitch:{
        search:"搜索",
        placeholder:"输入用例名称...",
    },
    testSetJobTable:{
        process_time:"用例耗时",
        noData:"暂无数据",
        error_1:"用例信息获取失败",
    },
    testSetDetail:{
        info:"测试集信息",
        info_1:"新建测试集",
        pro:"项目",
        pro_1:"涉及项目",
        validate_1:"测试集名称不能为空",
        validate_2:"测试集名称不能超过50个字符",
        time:" 小时",
        error_1:"测试集信息获取失败",
        error_2: "项目信息获取失败",
        success:"测试集信息修改成功！",
        error_3:"测试集不允许重名",
        error_4:"测试集信息修改失败",
        newSuccess:"测试集创建成功!",
        newFailed:"测试集创建失败",
        tit:"请输入完整信息",
    },
    createTboard:{
        select:"请先确定任务类型",
        type_1:"功能测试任务",
        type_2:"性能测试任务",
        type_3:"用例测试任务",
        selDev:"选择设备",
        selJob:"选择用例",
        write:"填写信息",
    },
    functionalTest:{ //功能性能一起
        list_1:"用例列表",
        list_2:"测试集列表",
        cardTit:"填写任务信息",
        tboardName:"任务名称",
        tboardRepeatTime:"运行轮次",
        random:"用例顺序随机",
        config:"任务配置",
        config_1:"设备 ",
        config_2:" 台；测试集 ",
        config_3:" 个；用例 ",
        config_4:" 台；用例 ",
        config_5:" 个",
        selDev:"已选设备",
        set:"测 试 集",
        complete:"启动任务",
        runError:"任务启动失败",
        errTit:"以下用例",
        errTit_2:"缺少资源文件，请尝试重新保存用例，是否继续运行其他用例？",
        continue:"继续",
        selTit:"请选择要进行测试的用例！",
        enterNum:"请输入运行轮次！",
        err_1:"服务器启动任务失败！",
        err_2:"启动失败！",
        err_3:"部分服务器启动失败！",
        success:"任务启动成功！",
        modalContent:"返回上一步将不会保存已选测试集，是否继续？",
        err_5:"任务启动失败",
        typeTit:"请选择测试柜类型",
        checkDev:"设备校验",
        checkDev_1:"请将设备",
        checkDev_2:"添加到testbox类型的pane上或取消勾选该设备",
        checkDevErr:"设备校验出错",
        delTit:"请选择要进行测试的设备！",
        getFail:"获取机柜类型失败！",
        cabinetTit:"请选择机柜类型！",
        //用例-任务型数据
        paired:"已配对",
        paired_1:"未配对",
        pcs:"台",
        selJob:"已选用例",
        jobName:"用例名称",
        devName:"设备名称",
        noDevTit:"当前选择的用例暂时没有找到符合条件的设备，请重新选取用例！",
        devFail:"设备匹配失败",
        jobMissing_1:"【用例】",
        jobMissing_2:"缺少资源文件，请尝试重新保存用例，再进行下一步操作！",
    },
    testSetSelView:{  // 新建测试集任务
        tit:"测试集目录",
        name:"测试集名称",
        getErr:"测试集信息获取失败",
        selOne:"请至少选择一个测试集！",
        error:"用例信息合并失败",
        modalTit:"返回上一步将不会保存已选测试集，是否继续？"
    },
    myTask:{
        toolTip:"开启后, 将关闭任务详情页面的遮罩，可以在多个任务之间快速切换浏览",
        view:"快速阅览",
    },
    tboardList:{
        header_1:"全部任务",
        header_2:"在测任务",
        header_3:"历史任务",
        selDate:"选择创建日期范围",
        searchTip:"输入任务名称搜索...",
        taskInfo:"确认任务信息",
        taskTip:"注意：启动任务前，请先确保设备注册机柜未发生改变。",
        board_name:"任务名称",
        repeat_time:"轮次",
        create:"启动任务",
        board_stamp:"创建日期",
        tboard_type:"任务类型",
        progress:"任务进度",
        success_ratio:"任务成功率",
        delTit_1:"确认删除任务 ",
        delTit_2:"吗?",
        delSuccess:"正在删除...该操作可能需要点时间，如需查看进度可进入清理中心页面！",
        stopTit:"确认停止任务 ",
        stopSuccess:"停止任务成功！",
        stopErr_1:"服务器停止任务失败!",
        stopErr_2:"停止失败!",
        stopErr_3:"停止任务失败！",
        missing:"以下用例缺少资源文件，请尝试重新保存用例再进行尝试!",
        createErr:"下发任务失败",
        progressErr:"进度读取失败！",
        ratioErr:"成功率获取失败！",
        selTit:"请先选择要删除的任务！",
        delTit:"您确定要删除这些任务吗?",
        delFail:"删除任务失败，请检查后重试!",
        userFail:"获取用户列表失败！",
        people:"操作人员",
        btn_again:"停止 / 删除 / 再来一次",
    },
    tboardDetail:{
        export:"导出数据",
        taskInfo:"任务信息",
        jobNum:"用例数量",
        devNum:"设备数量",
        testJob:"测试用例",
        up:"收起",
        down:"展开",
        testDev:"测试设备",
        username:"操作人员",
        end_time:"结束时间",
        result:"总体运行结果",
        success_ratio:"总成功率",
        total:"总共",
        pass:"成功",
        fail:"失败",
        invalid:"无效",
        devResult:"设备运行结果",
        devSuss:"设备成功率",
        devName:"设备名称",
        jobResult:"用例运行结果",
        jobSuss:"用例成功率",
        jobName:"用例名称",
        exportErr_1:"导出异常",
        exportErr_2:"正在导出...",
        exportErr_3:"导出失败",
    },
    tboardDetail_2:{  //二层结果：设备/用例维度
        successRatio:"成功率",
        result:"运行结果",
    },
    rdsManagement:{
        view_1:"设备数据视图",
        view_2:"日志文件搜索",
        view_3:"任务数据统计",
        view_4:"任务数据视图",
    },
    rdsDeviceView:{
        placeholderTime:"测试开始时间",
        selTips:"默认选择最近七天的数据",
        selBtn:"选取设备",
        selTips_2:"您还没有选择任何设备!",
        failData:"失败数据",
        invalidData:"无效数据",
        failRate:"总失败率",
        invalidRate:"总无效率",
        deviceList:"设备列表",
        result:"结果",
        error_1:"统计模块信息获取失败",
        modalTips:"最多只能选取150天的数据，已自动调整日期！",
    },
    rdsDeviceStatistic:{
        deviceTitle:"设备统计情况",
        nodata:"暂无数据信息！",
        jobStatistic:"用例统计",
        dev:"设备",
        devInfo:"设备详情",
        jobTitle:"用例统计情况",
        dataTip:"数据日历",
        job:"用例",
        jobInfo:"用例详情",
        day:"日",
        month:"月",
        format_1:"yyyy年MM月dd日",
        selTip_1:"请选择测试结果类型",
        selTip_2:"请选择无效类型",
        seriousFail:"严重失败",
        noMore:"暂无更多数据",
        format_2:"yyyy年MM月",
    },
    dynamicLoadingChart:{  //图表配置  三合一
        failRate:"失败率",
        invalidRate:"无效率",
        failCount:"失败数",
        invalidCount:"无效数",
        tips:"点击柱状图切换数据，左右拖拽加载更多数据",
        error_1:"图表数据加载失败",
        custom:"自定义名称",
        error_2:"数据获取失败",
        noMore:"已是最后一笔数据，没有更多了",
        isSend:"正在请求数据，请稍等！",
        isFirst:"已是第一笔数据",
        error_3:"月历数据获取失败",
    },
    rdsCard:{
        dataOne:"已经是第一条数据",
        dataLast:"已经是最后一条数据",
    },
    rdsDetail:{
        prev:"上一个",
        next:"下一个",
        photos:"测试图集",
        rdsInfo:"RDS信息",
        start_time:"开始时间",
        end_time:"结束时间",
        runTime:"运行时长",
        result:"测试结果",
        job_duration:"结果时间",
        lose_frame_point:"丢帧位置",
        view:"查看详情",
        jobInfo:"用例信息",
        label:"用例",
        from:"来自任务",
        devInfo:"设备信息",
        customName: "自定义编号",
        otherInfo:"其他信息",
        log:"日志文件",
        noLog:"暂无日志文件信息",
        downLoad:"全部下载",
        rom:"当时ROM版本",
        app:"App版本",
        pic:"截图",
        pic_1:"共 ",
        pic_2:" 张 ",
        noPic:"暂无截图信息",
        down:"下载",
        no:"无",
        err_1:"数据读取失败！",
        err_2:"截图获取失败！",
        tips:"您确定要删除该RDS吗？",
        tips_1:"起点、终点必须同时存在！",
        success:"数据保存成功",
        fail:"数据保存失败",
        hours:" 小时 ",
        minutes:" 分钟 ",
        seconds:" 秒",
    },
    deviceList:{
        other:"其他设备",
        adb:"ADB设备",
        cabinet:"机柜",
        history:"历史搜索",
        noHistory:"暂无历史搜索记录",
        device_label:"设备编号",
        device_name:"自定义名称",
        phone_model:"设备型号",
        tip_1:"当前状态不支持筛选功能！",
        rom_version:"ROM版本",
        android_version:"安卓版本",
        cpu_name:"CPU型号",
        status:"使用状态",
        tips_2:"只允许查看空闲状态的设备！",
        power:"电量",
        powerport:"充电口",
        tempport:"温感片",
        monitorport:"相机",
        subsidiary_device_count:"僚机数量",
        noPower:"无电量信息",
        powerErr:"电量数据载入失败！",
        err_1:"取得机柜信息出错",
        err_2:"获取僚机数量失败",
        err_3:"获取设备型号失败",
        slot:"位置",
    },
    rdsTboardView:{
        selBtn:"选取任务",
        selTips:"您还没有选择任何任务!",
        selBtn_2:"重选任务",
        status_1:"进行中",
        status_2:"已完成",
        pcs:"轮",
        tit_1:"创建",
        tit_2:"截止",
        tit_3:"历时",
        tabs_1:"设备统计",
        tabs_2:"用例统计",
        rdsNum:"RDS数量",
        err_1:"获取任务信息失败!",
    },
    rdsTboardDeviceStatistic:{
        tip_1:"设备统计情况",
        tip_2:"测试轨迹",
        tip_3:"温度曲线",
        tip_4:"电量曲线",
        tips_1:"请选择失败类型",
        btn:"点击加载更多",
        tabs:"设备运行结果",
        error:"获取无效类型出错",
        enter:"输入RDS ID",
        tips_2:"请输入正确的 RDS ID",
        tips_3:"输入设备名称...",
    },
    rdsTboardStatisticTable:{
        group_1:"数值",
        group_2:"百分比",
        pcs:"条/页",
        view:"详情",
        failRate:"失败率",
        invalidRate:"无效率",
        passRate:"成功率",
    },
    rdsLogSearch:{
        tips_1:"请输入关键字...",
        tips_2:"没有搜索结果，换个关键词试试！",
        error_1:"文件搜索失败！",
        tips_3:"请输入要搜索的关键字!",
        error_2:"读取日志文件失败!"
    },
    //rds 相关的一些其他页面数据
    rdsInfoPage:{
        tips_1:"该设备没有温度信息",
        temp:"温度",
        noPic:"暂无图片!",
        error_1:"rdsDict读取失败！",
        error_2:"图片获取失败！",
        // 测 试 图 集
        startPoint:"起点",
        endPoint:"终点",
        fps:"实际帧率",
        set_fps:"设置帧率",
        set_shot_time:"最大时长",
        top:"顶部",
        bottom:"底部",
        btn_1:"设为起点",
        btn_2:"设为终点",
        tableHead_1:"帧",
        tableHead_2:"拿图时间",
        tableHead_3:"停留",
        tableHead_4:"参数值",
        tips_2:"图片走丢了",
        start_method_1:"按下算法",
        start_method_2:"按下压感",
        start_method_3:"抬起压感",
        start_method_4:"图片变化",
        start_method_5:"点击自定义按键",
        end_method:"特征出现",
        error_3:"图集信息获取失败",
        tips_3:"未找到起点或终点！",
        lose_frame_point:"丢帧点",
        btn_3:"设为丢帧点",
        btn_4:"设为正常点",
        subsidiary_device:"【僚机",
    },
    perfDataView:{
        label_1:"启动时间数据",
        label_2:"其他性能数据",
        label_3:"机型分析",
        btn_1:"重选用例",
        btn_2:"重选机型",
        tit:"测试机型",
        label_4:"ROM分析",
        tips_1:"请先选择至少一个任务!",
        tips_2:"请选择一个用例进行分析！",
        tips_3:"最多添加5个机型进行分析！",
        tips_4:"请先选择至少一个机型进行分析！",
        tips_5:"已选机型中有重复机型，请重新选择再进行下一步！",
        error_1:"机型信息加载失败",
        //--------------------------
        btn_view:"数据预览",
        export:"导出",
        jobColumn_1:"平均值",
        jobColumn_2:"最大值",
        jobColumn_3:"中位数",
        jobColumn_4:"启动成功/次",
        jobColumn_5:"启动失败/次",
        warning_1:"暂无可导出的数据",
        label_5:"统计视图",
        btn_3:"刷新",
        error_2:"平均值获取失败",
        set_btn:"设置标准",
        set_tip:'请选择需要设置的标准',
        data_name:"数据名称",
        rule:"标准",
        sel_tip:"请至少选择一条数据！",
        warning_2:"请设置正确的标准",
        noChart:"暂无性能图表信息！",
        startTime:"启动时间",
        error_3:"图表加载失败",
        times:"次数",
        option_1:"应用启动时间",
        option_2:"启动时间出现频数",
        loadMore:"加载更多",
        //---------------------------------
        title:"启动时间分布",
        error_4:"表格数据加载失败!",
        title_1:"各机型启动时间均值对比",
        title_2:"各机型启动时间分布对比",
        title_3:"详细数据",
        title_4:"厂商-机型",
        title_5:"启动成功次数",
        title_6:"启动失败次数",
        chartTit:"均值",
        chartTit_1:"启动时间均值",
        error_5:"盒须图加载失败",
    },
    deviceDetail:{
        start_time_key:"加入时间",
        status:"状态",
        status_update_time:"状态变更时间",
        model:"机型信息",
        phone_model_name:"手机型号",
        subsidiary_device_info:"僚机设备信息",
        subsidiary_device:"僚机",
        card:"卡",
        account_info:"账号",
        simInfo:"卡信息",
        unbound:"批量解绑",
        account_info_2:"账号信息",
        temp:"温度感应片配对",
        power:"智能充电口配对",
        checkPowerPort:"查询充电口状态",
        camera:"工业相机配对",
        other:"其他",
        switch:"是否开启",
        remove:"移除设备",
        reconnect:"重新连接",
        release:"从任务中释放",
        release_2:"解除设备关联",
        config:"配置机型信息",
        selTip:"请选择僚机位置",
        slot:"僚机位置",
        isAdd:"正在添加...",
        removw_2:"解绑资源后移除",
        removw_3:"仅移除设备",
        remove_4:"强制移除",
        manufacturer:"厂商信息",
        ip:"IP地址",
        tips_1:"移除设备将停止执行任务，确认要移除设备吗？",
        tips_2:"移除设备将停止执行任务，设备绑定了附加资源，请选择要进行的操作。",
        tips_3:"确认要移除设备吗？",
        tips_4:"设备绑定了附加资源，请选择要进行的操作。",
        tips_5:"确认要从任务中释放该设备吗？",
        tips_6:"释放设备成功",
        tips_7:"离线设备请直接走注册流程",
        tips_8:"请将信息填写完整！",
        tips_9:"自定义名称只允许输入汉字、英文字母、数字、括号和中下划线",
        tips_10:"重连成功",
        tips_11:"该设备已从系统中移除",
        error_1:"设备无法连接",
        error_2:"服务器，需要强制从系统中移除吗?",
        error_3:"设备移除失败",
        error_4:"读取硬件端口数据时出错! ",
        error_5:"读取数据时出错!",
        configSuccess:"配置成功",
        configFailed:"配置失败",
        releaseTips_1:"设备解除关联成功",
        releaseTips_2:"设备解除关联失败，请确认后重试！",
        removeTips_1:"您确定要解绑僚机",
        removeTips_2:"吗？",
        removeTips_3:"僚机解绑成功",
        removeTips_4:"僚机解绑失败",
        slotTips_1:"请先选择僚机位置",
        slotTips_2:"请选择要添加的僚机",
        slotTips_3:"添加僚机成功",
        slotTips_4:"僚机添加失败!",
        slotTips_5:"僚机信息获取失败",
        sourceTips_1:"资源信息获取失败",
        sourceTips_2:"请选择要绑定的SIM卡！",
        sourceTips_3:"SIM卡绑定成功",
        sourceTips_4:"SIM卡绑定失败",
        sourceTips_5:"请选择要绑定的APP资源！",
        sourceTips_6:"绑定失败",
        sourceTips_7:"app账号资源",
        sourceTips_8:"已经超出最大登录数，绑定失败",
        sourceTips_9:"绑定成功！",
        sourceTips_10:"app账号资源绑定失败;",
        unbindTips_1:"您确定要解绑该SIM卡吗？",
        unbindTips_2:"SIM卡解绑成功",
        unbindTips_3:"SIM卡解绑失败",
        unbindTips_4:"您确定要解绑该账号资源吗？",
        unbindTips_5:"账号资源解绑成功",
        unbindTips_6:"账号资源解绑失败",
        unbindTips_7:"没有可批量解绑的SIM卡资源",
        unbindTips_8:"您确定要解绑所有SIM卡资源吗?",
        unbindTips_9:"没有可批量解绑的账号资源",
        unbindTips_10:"您确定要解绑所有账号资源吗?",
        unbindTips_11:"资源解绑成功",
        unbindTips_12:"资源解绑失败:",
        powerTips_1:"充电口已开启，要关闭充电口停止为设备充电吗？",
        powerTips_2:"关闭充电口",
        powerTips_3:"充电口关闭成功",
        powerTips_4:"充电口操作失败，请联系管理员处理！",
        powerTips_5:"充电口已关闭，要开启充电口为设备充电吗？",
        powerTips_6:"开启充电口",
        powerTips_7:"充电口开启成功",
        powerTips_8:"充电口操作失败，请联系管理员处理！",
        powerTips_9:"继电器失联，请联系管理员处理！",
    },
    deviceManagement:{
        label_1:"测试设备列表",
        label_2:"僚机列表",
        label_3:"附加资源列表",
        label_4:"设备地图",
        label_5:"硬件设备列表",
        tips_1:"第一步: 请对待添加设备执行",
        tips_2:"将设备添加到专用USB接口",
        tips_3:"将添加设备连接到TMach系统WLAN",
        tips_4:'开启"USB调试功能"与"通过USB安装APP"',
        tips_5:'关闭"自动亮度调节"，并调整到适当亮度，同时设置屏幕为常亮',
        tips_6:'请在待添加设备弹出窗口中勾选 始终允许这台计算机进行调试 如果已设置，可直接点击 下一步',
        tips_7:"第二步: 选择机柜",
        tips_8:"机柜列表",
        tips_9:"机柜内已有设备数量",
        tips_10:"注：每个机柜建议注册不超过50台设备",
        tips_11:"设备类型",
        tips_12:"第三步: 添加设备",
        manufacturer:"厂商名称",
        manufacturerTips:"请选择或新建厂商信息",
        btn_1:"重新扫描",
        btn_2:"返回上一步",
        error_1:"获取设备数量出错",
        info_1:"带*项信息不能为空！",
        error_2:"僚机添加失败！",
        error_3:"请先选择机柜信息",
        error_4:"扫描设备失败",
        error_5:"ip侦测失败",
        error_6:"侦测不到该设备的IP地址，请确认待添加设备已连接到TMach系统WLAN！",
        error_7:"请确认当前设备是否连接到TMach系统中",
        error_8:"请确认当前系统中是否连接了多个僚机设备",
        error_9:"该设备已被注册，请先将其移除，再进行操作",
        info_2:"第一步: 设置设备亮度并选择机柜",
        info_3:"第二步: 添加设备",
        info_4:"请选择或新建设备型号",
        info_5:"机型厚度",
        info_6:"毫米",
        info_7:"设备型号不允许输入空格、/、\\ 等特殊字符",
        info_8:"添加失败！请检查电脑网络连接是否正确",
    },
    subsidiaryDevice:{
        tips_1:"输入设备自定义名称",
        tips_2:"关联主机",
        tips_3:"获取僚机列表失败",
        tips_4:"X边框厚度",
        tips_5:"Y边框厚度",
        tips_6:"当前设备正在执行任务，不允许移除",
        tips_7:"您确定要从系统中移除该设备吗?",
        tips_8:"获取僚机详情出错!",
        tips_9:"自定义名称不能为空!",
        tips_10:"自定义名称修改成功",
        tips_11:"自定义名称修改失败",
        tips_12:"自定义编号修改成功",
        tips_13:"自定义编号修改失败",
    },
    resourcesList:{
        tips_1:"SIM卡资源列表",
        tips_2:"账号资源列表",
        tips_3:"添加SIM卡资源",
        tips_4:"添加账号资源",
        tips_5:"编辑App",
        tips_6:"导入资源",
        tips_7:"导出资源",
        tips_8:"请选择要删除的SIM卡资源!",
        tips_9:"确认要删除已选择的资源吗？",
        tips_10:"SIM卡资源删除成功！",
        tips_11:"SIM卡资源删除失败;",
        tips_12:"请选择要删除的APP账号资源！",
        tips_13:"确认要删除已选择的资源吗？",
        tips_14:"app账号资源删除成功！",
        tips_15:"app账号资源删除失败;",
        exportTips_1:"资源导入成功！",
        exportTips_2:"资源导入失败！",
        exportTips_3:"请选择需要导出的SIM卡资源！",
        exportTips_4:"确认要导出已选择的SIM卡资源吗？",
        exportTips_5:"SIM卡资源导出失败;",
        exportTips_6:"请选择需要导出的APP账号资源！",
        exportTips_7:"确认要导出已选择的账号资源吗?",
        exportTips_8:"app账号资源导出失败;",
        operator:"运营商",
        operator_1:"中国移动",
        operator_2:"中国联通",
        operator_3:"中国电信",
        phone_number:"手机号",
        volte:"是否Volte",
        yes:"是",
        no:"否",
        status:"资源状态",
        status_1:"未占用",
        status_2:"占用",
        statusTips:"只允许查看空闲状态的资源！",
        connection:"关联设备/僚机",
        history_relevance:"历史关联",
        error_1:"获取SIM卡资源信息失败",
        error_2:"SIM卡资源移除成功",
        error_3:"SIM卡资源移除失败;",
        edit:"编辑",
        error_4:"确定要移除资源SIM卡",
        remove:"移除",
        title_1:"SIM卡资源信息",
        title_2:"请输入正确的手机号",
        commit:"提交",
        title_3:"请先将信息填写完整再提交!",
        title_4:"请输入正确的11位手机号!",
        title_5:"SIM卡资源添加成功!",
        title_6:"SIM卡资源添加失败!",
        title_7:"SIM卡信息修改成功!",
        title_8:"SIM卡信息修改失败!",
    },
    appInfo:{
        tips_1:"输入账号搜索...",
        tips_2:"用户名/昵称",
        tips_3:"绑定手机号",
        tips_4:"关联设备(僚机)",
        tips_5:"已登录/可登录",
        tips_6:"获取账号资源信息失败",
        tips_7:"账号资源移除成功",
        tips_8:"账号资源移除失败;",
        tips_9:"app列表获取失败",
        tips_10:"确定要移除资源账号",
        title_1:"账号资源信息",
        title_2:"APP名称不能为空",
        title_3:"账号不能为空",
        title_4:"密码不能为空",
        title_5:"用户名不能为空",
        title_6:"账号资源添加成功",
        title_7:"账号资源添加失败! 当前app下已有该账号",
        title_8:"账号资源添加失败!",
        title_9:"账号信息修改成功",
        title_11:"账号信息修改失败",
        title_10:"请先将账号信息填写完整",
        editTips_1:"App列表",
        editTips_2:"添加App",
        editTips_3:"输入App名称...",
        editTips_4:"App信息",
        editTips_5:"App名称",
        editTips_6:"请输入要添加的App名称",
        editTips_7:"最大登录数",
        editTips_8:"该项不能为空",
        editTips_9:"请选择要删除的App!",
        editTips_10:"确认要删除App",
        editApp_1:"App添加成功",
        editApp_2:"App添加失败",
        editApp_3:"修改失败",
    },
    paneView:{
        tips_1:"设备情况",
        tips_2:"暂无设备",
        tips_3:"正常",
        tips_4:"异常",
        tips_5:"添加Pane",
        tips_6:"选择机柜",
        tips_7:"Pane名称",
        tips_8:"注：名称由字母、数字或下划线组成，不允许输入特殊字符",
        tips_9:"格式：名称 @ 规格行 X 规格列，最大规格不能超过 9 x 9",
        tips_10:"类型",
        tips_11:"注：请在灰色位置区域添加要添加的设备！",
        tips_12:"例",
        tips_13:"请输入pane名称",
        title_1:"取得paneView信息列表失败",
        title_2:"请输入项目名称!",
        title_3:"请选择机柜!",
        title_4:"格式错误!",
        title_5:"该项目名称已存在，请重新输入!",
        title_6:"项目添加失败,请检查后再重新添加!",
        title_7:"该区域已有设备，请在未放置设备区域添加设备!",
        title_8:"您确定要在该位置",
        title_9:"处添加设备吗?",
        title_10:"请先选择一台设备",
        notices_1:"添加设备成功，请继续添加或关闭弹窗！",
        notices_2:"添加设备成功！",
        notices_3:"添加设备失败！",
        notices_4:"获取异常数据失败！",
    },
    paneCard:{
        btn_1:"添加设备",
        btn_2:"移除支架",
        tips_1:"您确定要移除该支架吗？",
        tips_2:"支架移除成功!",
        tips_3:"当前支架还有设备存在，请先移除设备之后再进行支架移除！",
        tips_4:"未知错误：支架移除失败，请检查后重试！",
        tips_5:"当前位置暂无设备，请先添加设备后再进行查看设备详情！",
    },
    paneDeviceConfig:{
        action_1:"拼接图像",
        action_2:"相机设置",
        action_3:"坐标换算",
        action_4:"待命位置",
        action_5:"调节z值",
        border:"边框信息",
        title_1:"x,y 是基于边框左上角点的相对坐标；屏幕水平面 z=0，屏幕朝向方向 z 为正(单位：mm)",
        new:"新建",
        btn_1:"完成",
        title_2:"请在图中框选边框或选取坐标点",
        high_1:"亮",
        high_2:"暗",
        btn_2:"重新获取图片",
        title_3:"按下鼠标按键并拖动来框选区域，按下Ctrl可遮罩图片外的内容",
        title_4:"请点击空白处隐藏边框后，再按下鼠标左键选点",
        title_5:"请将手机屏幕调至较亮画面，并摆正手机",
        title_6:"若长时间获取不到图片，请尝试重新获取",
        title_7:"正在努力获取图像...",
        name:"名称",
        title_8:"名称不能为空",
        tips_1:"坐标",
        tips_2:"(精确到0.1mm)",
        btn_3:"测试",
        cameraSet:"相机设置",
        cameraSet_1:"曝光模式",
        cameraSet_2:"标准曝光",
        cameraSet_3:"高曝光",
        cameraSet_4:"旋转角度",
        adjustTitle_1:"按压过轻时，请调大机械臂z值，范围",
        adjustTitle_2:"x向右为正，左机械臂x范围",
        adjustTitle_3:"右机械臂x范围",
        adjustTitle_4:"x向右为正，范围",
        adjustTitle_5:"y向下为负，范围",
        left:"左",
        zLeft:"左机械臂z值",
        right:"右",
        zRight:"右机械臂z值",
        zValue:"机械臂z值",
        standbyTips_1:"机械臂的待命位置",
        standbyTips_2:"z向上为正，范围",
        standbyTips_3:"默认值",
        isSend:"正在发送...",
        testCount:"测试点击次数",
        coordinateTips_1:"两个换算点的物理x坐标和y坐标，单位mm",
        zRange:"z 坐标范围为",
        isSend_2:"正在发送请求...",
        warnTips_1:"请框选正确的边框信息！",
        warnTips_2:"相机信息获取失败",
        warnTips_3:"相机设置保存成功",
        warnTips_4:"坐标获取失败",
        warnTips_5:"请等待当前操作完成",
        warnTips_6:"坐标点x，y值不能为空！",
        warnTips_7:"请输入正确范围内的坐标值",
        warnTips_8:"两个物理坐标点x坐标不能相同!",
        error_1:"坐标换算失败",
        error_2:"拼接图像成功",
        error_3:"拼接图像失败",
        error_4:"调试距离成功",
        error_5:"调试距离失败",
        error_6:"mlocation保存成功",
        rangeTit_1:"x 的取值范围为",
        rangeTit_2:"y 的取值范围为",
        rangeTit_3:"z 的取值范围为",
        validate_1:"左机械臂值不能为空",
        validate_2:"右机械臂值不能为空",
        validate_3:"机械臂值不能为空",
        wait:"请等待当前指令执行完成...",
        save_1:"机械臂的值保存成功",
        testCountTit:"请输入点击次数",
        armTips_1:"机械臂正在使用无法点击，确定要停止当前的动作吗？",
        armTips_2:"停止成功",
        testTips_1:"请先选择一条数据!",
        testTips_2:"请将坐标信息填写完整!",
        testTips_3:"边框信息不能为空!",
        testTips_4:"请等待获取图片",
        testTips_5:"正在自动获取，可能需要一些时间",
        testTips_6:"边框获取成功",
        testTips_7:"x1的值必须小于x2的值",
        testTips_8:"y1的值必须小于y2的值",
        borderTips_1:"屏幕边框必须是一个区域",
        borderTips_2:"该项只能选取一个点，不能选取区域",
        borderTips_3:"请先框选边框信息!",
        saveTips_1:"表格内信息不能为空！",
        saveTips_2:"机型厚度不能为空！",
        saveTips_3:"边框信息保存成功！",
        saveTips_4:"按键坐标保存成功！",
        saveTips_5:"名称已存在！",
        delError:"当前项不允许删除！",
        delError_1:"确定要删除这条数据吗？",
    },
    cleanCenter:{
        list_1:"删除列表",
        list_2:"失败列表",
        btn_1:"重试",
        btn_2:"联系客服",
        btn_3:"联系方式",
        btn_4:"联系电话",
        btn_5:"微信公众号",
        socket_1:"您的浏览器不支持socket",
        socket_2:"正在删除",
        socket_3:"已删除",
        socket_4:"待删除",
        socket_5:"暂无需要删除的数据!",
        socket_6:"正在重新执行删除操作，请稍后！",
        socket_7:"重新删除操作失败，请检查后重试!",
    }
}
