<template>
    <Card>

    </Card>
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        methods:{
            refresh(url){
                this.$ajax.get(url)
                    .then(response=>{
                        console.log(response)
                    })
                    .catch(error=>{
                        console.log(error)
                    })
            }
        }
    }
</script>