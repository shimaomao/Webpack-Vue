require('../../css/demo/test.less');


import Vue from 'vue';
import axios from 'axios';
import $ from 'webpack-zepto';

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
        console.log($);
        console.log(axios);
    },
    methods: {

    }
})
