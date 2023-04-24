export default {
    public:{
        error_500:"服务器错误!",
        btn_close:"关闭",
        btn_ok:"确认 ",
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
    rdsTboardView:{

    }
}
