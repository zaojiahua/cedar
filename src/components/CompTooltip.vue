<template>
    <div :class="[prefixCls]" @mouseenter="handleShowPopper" @mouseleave="handleClosePopper">
        <div :class="[prefixCls + '-rel']" ref="reference">
            <slot></slot>
        </div>
        <div
            :class="[prefixCls + '-popper', prefixCls + '-' + theme]"
            :style="dropStyles"
            ref="popper"
            v-show="!disabled && (visible || always)"
            @mouseenter="handleShowPopper"
            @mouseleave="handleClosePopper"
            :data-transfer="transfer"
            v-transfer-dom>
            <div :class="[prefixCls + '-content']">
                <div :class="[prefixCls + '-arrow']"></div>
                <div :class="innerClasses" :style="innerStyles"><slot name="content">{{ content }}</slot></div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Tooltip} from 'view-design';

    export default {
        name: 'CompTooltip',
        mixins: [Tooltip],
    };
</script>
