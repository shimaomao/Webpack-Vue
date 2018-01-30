import '../../css/demo/test2.less';

import Vue from 'vue';
import axios from 'axios';
//import $ from 'webpack-zepto';
//import eruda from '../components/eruda.min.js';

new Vue({
    el: '#app',
    data: {
        rules:true
    },
    computed: {

    },
    created: function() {

    },
    mounted: function() {
        //eruda.init();
        //console.log($);
        console.log(axios);
    },
    methods: {

    }
});
