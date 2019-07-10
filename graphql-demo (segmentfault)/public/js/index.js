
window.onload = function () {

    /* 普通 restFul student 接口 */
    $('#btn2').click(function() {
      $.ajax({
        url: '/studentDetail',
        data: {},
        success:function (res){
          if (res.success) {
            renderStudent (res.data)
          }
        }
      })
    })
    
    /* 普通 restFul course 接口 */
    $('#btn1').click(function() {
      $.ajax({
        url: '/course',
        data: {},
        success:function (res){
          if (res.success) {
            renderCourse(res.data)
          }
        }
      })
    })
  
    function renderStudent (data) {
      var str = ''
      data.forEach(function(item) {
        str += '<li data-id=' + item._id + '>姓名：'+item.name+'，性别：'+item.sex+'，年龄：'+item.age+'</li>'
      })
      $('#studentList').html(str)
    }
  
    function renderCourse (data) {
      var str = ''
      data.forEach(function(item) {
        str += '<li>课程：'+item.title+'，简介：'+item.desc+'</li>'
      })
      $('#courseList').html(str)
    }
    
    // 请求看query参数就可以了，跟查询界面的参数差不多
    /* query 查询数据：一次查询出上面两个接口的数据 */
    $('#btn3').click(function() {
      $.ajax({
        url: '/graphql',
        data: {
          query: `query{
            student{
              _id
              name
              sex
              age
              info{
                _id
                height
                weight
                hobby
              }
            }
            course{
              title
              desc
            }
          }`
        },
        success:function (res){
          renderStudent (res.data.student)
          renderCourse (res.data.course)
        }
      })
    })

    /* mutation 变更数据 */
    $('#btn4').click(function() {
      $.ajax({
        url: '/graphql',
        type: 'POST',
        data: {
          query: `mutation {
            updateStudent (
              _id: "${$('#studentList>li').eq(0).attr('data-id') || '5d2302ccd38b9a0ed4a370f7'}"
              name: "test${Math.random().toFixed(2)}"
              age: 14
            ) {
              _id
              name 
              age
            }
          }`
        },
        success: function(res) {
          console.log(res);
          $('#btn2').trigger('click');
        }
      })
    })

    /* 后端维持 restFul 接口，前端增加 graphql 层 */
    /* $('#btn5').click(function() {
      $.ajax({
        url: '/graphql',
        data: {
          query: `query{
            testRestFulStudent{
                _id
                name
                sex
                age
                info{
                  _id
                  height
                  weight
                  hobby
                }
              }
              testRestFulCourse{
                title
                desc
              }
          }`
        },
        success: function(res) {
          renderStudent(res.data.testRestFulStudent);
          renderCourse(res.data.testRestFulCourse);
        }
      })
    }) */

    $('#btn5').click(function() {
      $.ajax({
        url: '/graphql',
        data: {
          query: `query{
            testRestful{
              student{
                _id
                name
                sex
                age
                info{
                  _id
                  height
                  weight
                  hobby
                }
              }
              course{
                title
                desc
              }
            }
          }`
        },
        success: function(res) {
          renderStudent(res.data.testRestful.student);
          renderCourse(res.data.testRestful.course);
        }
      })
    })
    
  }
  