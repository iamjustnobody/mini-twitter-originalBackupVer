//$(document).ready(()=>{alert('heelp')})
/*
/////const userLoggedInJs=document.querySelector(".mainSectionContainer").dataset.currentUser
/////document.querySelector(".wrapper") ///document.querySelector("body") 
//const userLoggedInJs=document.querySelector(".homeContent").dataset.currentuser
//const userLoggedInJs=JSON.parse(document.querySelector(".homeContent").dataset.currentuser)
///.data() is not a function; .dataset.currentUser undefined //lowercase in js
///NOT (data-currentUser=`${userLoggedIn}`) ; (data-currentUser=userLoggedIn)
///data-currentUser=`${JSON.stringify(userLoggedIn)}` or `${userLoggedInJs}` or userLoggedInJs
///need to parse (better parse) see notebook & home.pug
///data-cur-user in home.pug as app.js GET '/' render home page so create .homeContent class in home.pug //could also in main-layouts as homePug extend mainlayoutPug .testLoginUser class &data-cur-user
console.log("common.js - ",userLoggedInJs,userLoggedInJs._id,typeof userLoggedInJs)
//const userLoggedInJs=xx defined in common.js so better to have script commonJS before homeJs in main-layouts.pug especially IF userLoggedInJs used in home.js too
 ///the above +home.pug (.homeContent &data-) == scripts userLoggedIn in main-layouts.pug
 ////above.homeContent@home.pug data-currentUser
 */ 
/*
//below a couple of lines for scripts in main-layouts.pug or in branch.pugs
 //console.log("userLoggedIn: ",userLoggedIn,typeof userLoggedIn)
console.log("userLoggedInJs: ",userLoggedInJs,typeof userLoggedInJs) //app.js get'/' -> main-layouts -> common.js
//obj above 
*/
/*
 //.testLoginUser@main-layouts data-currentUser
const userLoggedInJs=document.querySelector(".testLoginUser").dataset.currentuser
console.log("common.js - ",userLoggedInJs,userLoggedInJs._id,typeof userLoggedInJs,typeof userLoggedInJs._id,typeof userLoggedInJs.id)
//userLoggedInJs obj //userLoggedInJs.id undefined; ._id string
*/
/*
 //.testLoginUserProfile@profilePage.pug data-currentUser
const userLoggedInJs=JSON.parse(document.querySelector(".testLoginUserProfile").dataset.currentuser)
console.log("common.js - ",userLoggedInJs,userLoggedInJs._id,typeof userLoggedInJs,typeof userLoggedInJs._id,typeof userLoggedInJs.id)
//obj string undefined //string undefined undefined if no JSON.parse
*/


$("#postTextArea,#replyTextArea").keyup(event=>{
    var textbox=$(event.target);
    var value=textbox.val().trim();
    //console.log("value",value)
    var isModal=textbox.parents(".modal").length==1; //if 1 has .modal of 0 then no .modal
    //console.log("isModal",isModal)
    //var submitBtn=$('#submitPostButton'); //b4 adding "#replyTextArea"
    var submitBtn=isModal?$('#submitReplyButton'):$('#submitPostButton'); //now "#replyTextArea" added
    //console.log("submitBtn",submitBtn)
    if(submitBtn.length==0){return alert('no submit button found');}
    if(value===''){
        submitBtn.prop('disabled',true);
        return;
    }
    submitBtn.prop('disabled',false);
})
/*
$('#submitPostButton').click(event=>{
    var btn=$(event.target);
    var textbox=$("#postTextArea");
    var data={
        textContent:textbox.val()  //match to req.body.content in below ajax call
    }
    $.post('/api/posts',data,(postData,status,xhr)=>{
    //    console.log(postData) //populated newPost sent back by posts.js post '/'
        var htmlEl=createPostHtml(postData)
        $('.postsContainer').prepend(htmlEl)
        textbox.val('')
        btn.prop('disabled',true)
    })
})*/ //ok but now add submitReplyBtn as below
$('#submitPostButton,#submitReplyButton').click(event=>{
    var btn=$(event.target);

    var isModal=btn.parents(".modal").length==1;
    var textbox=isModal?$("#replyTextArea"):$("#postTextArea");

    var data={
        textContent:textbox.val()  //match to req.body.content in below ajax call
    }

    if(isModal){
        var id=btn.data().id; console.log("id",id,typeof id);//string
        if(id==null) return alert("Button id is null")
        data.replyTo=id;
    }

    $.post('/api/posts',data,(postData,status,xhr)=>{
    //    console.log(postData) //postData=populated newPost sent back by posts.js post '/'
    //or postData=populated new comment Post
    console.log('newPostData.id',postData.id,typeof postData.id,'newPostData._id',postData._id,typeof postData._id)
 //undefined undefined//string  //its like newPost/postData (Obj) being populated
 
 if(postData.commentedPost){
    console.log('newPostcommentedPost frontend',postData.commentedPost,postData.commentedPost._id,postData.commentedPost.id)
    console.log(typeof postData.commentedPost,typeof postData.commentedPost._id,typeof postData.commentedPost.id) 
    console.log('newPostcommentter frontend',postData.commentedPost.postedBy,postData.commentedPost.postedBy_id,postData.commentedPost.postedBy.id) 
    console.log(typeof postData.commentedPost.postedBy,typeof postData.commentedPost.postedBy_id,typeof postData.commentedPost.postedBy.id) 
} //.commentedPost populated in the backend (but no fields of commentedPost being populated) - obj string undefined
//  .commentedPos.postedBy not being populated on server - string undefined undefined
  if(postData.commentedPost){location.reload()} //for submitting comments
        //reload the page '/'getAllPosts home.js //modal gone when reflesh page
        //below for submitting normal post -> not reflesh page just append instead
        var htmlEl=createPostHtml(postData)
        $('.postsContainer').prepend(htmlEl)
        textbox.val('')
        btn.prop('disabled',true)
    })
})
//$('.likeButton').click(event=>{}) //click attached to likebtn but this script loaded lag htnl page
$(document).on('click','.likeButton',(event)=>{// click attached to document onload
    //get post Id; just like get tour details 
    //but they (not using ajax call api route from frontend; directly use a href='/' in html & viewsRoutes (tourdetails.pug) for '/:id' page then viewscontroller to gettourid from db
    // so data attributes in html in fn createPostHtmls top tree
    var btn=$(event.target);
    var postId=getPostIdFromElment(btn) //?why btn?
    console.log(postId, typeof postId) //string
    
    if(postId===undefined) return;
    $.ajax({
    //    url:"/api/posts/:post-id",//should be /:postid NOT /:post-id
    url:`/api/posts/${postId}/like`,
        type:"PUT",
        success:(updatedPostData)=>{ //updatedPost from put('/:postid/like') in posts.js
            console.log(updatedPostData)
            console.log("id",updatedPostData.id,typeof updatedPostData.id,'_id',updatedPostData._id,typeof updatedPostData._id)
            //undefined undefined //string
            btn.find('span').text(updatedPostData.likes.length||'');

            if(updatedPostData.likes.includes(userLoggedInJs._id)){
                btn.addClass("active");
            }else{
                btn.removeClass("active")
            }
        }
    })

    //check if user likes it or not; need to get access user 
    //but '/' in app.js rendering Home page with payload userLoggedIn(for pug) -> also needed in javascript
//click like or retweet or unretweet btn on reweetPost or retweetedPost, current clickedPost number & color change immediately;
//but actually affecting all posts (original retweetedPost & retweetPosts) -> show updated number & color on reflesh
})

$(document).on('click','.retweetButton',(event)=>{
    var btn=$(event.target);
    var postId=getPostIdFromElment(btn) 
    console.log(postId, typeof postId)
    
    if(postId===undefined) return;
    $.ajax({
    url:`/api/posts/${postId}/retweet`,
        type:"POST",
        success:(retweetedPost)=>{ //unpopulated updated (parent) post from put('/:postid/retweet') in posts.js 
            //no createhtml element & append //no dsappend either if untweet
            console.log(retweetedPost)
            console.log("id",retweetedPost.id,typeof retweetedPost.id,'_id',retweetedPost._id,typeof retweetedPost._id)
            //below only appies to current clicked post 
            //(not applies to retweetPost if click retweetedParentPost, or retweetedParentPost if click retweetKidPost)
            //the above applies to likebutton too
            btn.find('span').text(retweetedPost.retweetUsers.length||'');
            if(retweetedPost.retweetUsers.includes(userLoggedInJs._id)){
                btn.addClass("active");
            }else{
                btn.removeClass("active")
            }
        }
    }) 

})
//delete retweetedPost -> retweetPost's content become undefined
//delete retweetPost-> actually delete retweetedPost -> retweetPost's content become undefined

$("#replyModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget); //event.target is modal; relatedTarget is btn//or ()=>{var btn=$(event.target)}
    var postId=getPostIdFromElment(btn)

    //attach cur post id to submitreplyBtn //data attribute is "id" & its value is postId
    $("#submitReplyButton").data("id",postId) //open modal id on the button
//    $("#submitReplyButton").data() stored in Jqeury cache not stored in element; $("#submitReplyButton").attr("data-id",postId)

    $.get(`/api/posts/${postId}`,(getPost)=>{ //or $.get('/api/posts/$'+ postId,xxx) no backtick //get populated single post
        //    outputPosts(getPost,$('#originalPostContainer'))//output single post getPost given
            outputPosts(getPost.thisPostData,$('#originalPostContainer')) 
            //previously getPost is returned thisPostData from postsJs backend api; now return thisPost and ex-getPost==thisPost.thisPostData
        })//getPost=returned result or most fields of thisPosstData from get('/:id') api routes backend
})
$("#replyModal").on("hidden.bs.modal",() => $('#originalPostContainer').html(''))
//retweet / like / comment all on original post even if click on retweetPost
//retweet & comment add a new seperate post to all posts


$("#deletePostModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget); 
    var postId=getPostIdFromElment(btn)

    //attach current post id to deleteBtn when open modal//data attribute is "id" & its value is postId
    $("#deletePostButton").data("id",postId)  //data-id="${postData._id}" @createHTMLelement btn
    console.log($("#deletePostButton").data().id,typeof $("#deletePostButton").data().id)
})
$("#deletePostButton").on('click',(event)=>{ //#deletePostButton added to the page when page is loaded (mixin createDeletePost)
    //so detelebtn is there when page's loaded so clickHandler attached to deletebtn (sure clickHandler can be attached to document too)
    var Id=$(event.target).data('id') //data-id="${postData._id}" in createHTML element button
    console.log('deletedPostId',Id,typeof Id)  //string
    
    $.ajax({
        url:`/api/posts/${Id}`,
            type:"DELETE",
            success:(deletedPost,status,xhr)=>{ //status is status msg; statusCode is in xhr
                if(xhr.status!=202){alert("could not delete the post");return;}
                location.reload()
            }
        })
})  //the original & retweet posts are deletable only to original postedBy; retweetUsers small font at top/left corner
//click/ delete any would delete just teh original (retweeted) post; 
//later retweetPosts exist but undefined & retweetUsers (large font) shows undefined post that's now deletable by retweetUser 
//delete commentedPost -> comments posts remain without 'reply to' text

$(document).on('click','.post',(event)=>{
    var element=$(event.target);
    var postId=getPostIdFromElment(element) //just return .post element
    console.log(postId,typeof postId) //string
    
    if(postId===undefined) return;
    if(postId!=undefined&&!element.is('button')) window.location.href='/post/'+postId //matched to app.use("/post",postRoute)
    //create postRoutes (for above url), postPage pug&js for single selected post; 
    //similar to app.get('/') in app.js, home pug&js for all posts
    //api router.get('/' or '/:id') for all posts (onloading/rendering home page) & single post
    //open retweetedPost; commentedPost if any +currentPost+comments if any
})


//below one could be in profilePage.js & searchPage.Js
$(document).on('click','.followButton',(event)=>{ //css class of followButton
    var button=$(event.target);
    var profileUserId=button.data().userid;
    //data-userid='${userData._id}'in searchJs createUserHtml (appended to .resultsContainer); f&F pug only has .resultsContainer 
    //data-userid=`${user._id}` in mixin.pug createFollowButton(user,isFollowing) used in profilePage.pug
    //making sure above two have same naem for datset
    console.log("profileUserId",profileUserId,typeof profileUserId)

    $.ajax({
        url:`/api/users/${profileUserId}/follow`, //for userloggedin to either follow or unfollow the profileuser//profileuser to be followed or unfollowed
            type:"PUT",
            success:(updatedUserData,status,xhr)=>{ //updatedUser(loggedinUser that follows profileUser) from put('/:userid/follow') in userss.js
                console.log(updatedUserData) //only has._id
                console.log("id",updatedUserData.id,typeof updatedUserData.id,'_id',updatedUserData._id,typeof updatedUserData._id)
                //undefined string no matter passed in is mongoDOc or req.session.user from '/api/users
                if(xhr.status==404) return alert("user not found")

                var diff=1;
                if(updatedUserData.following && updatedUserData.following.includes(profileUserId)){
                    button.addClass("following")
                    button.text("Following")
                }else{
                    button.removeClass("following")
                    button.text("Follow")
                    diff=-1;
                }
                //profileUser's following & followers; only have profileUser's ID at the mo; not profileUser's obj
                //ajax call findById checking profileUers' followers & following's lengths
                //or simply just add/remove number (below) together with above button css class
                var followersLabel=$("#followersValue") 
                if(followersLabel.length!=0){ //if we are on profile page
                    var followersText=followersLabel.text() //followersLabel.text("")
                    //followersLabel.text(followersText+1); //.text() above => o1 011 //.text("") above => [obj obj] 1
                    //followersLabel.text(followersText*1+1); //real number // ok //or below parseInt
                    followersText=parseInt(followersText);
                    followersLabel.text(followersText+diff); //followersLabel.text(followersText+1); 
                }
            }
        })
})




//upload user profile photo/pic /user images
var cropper
/*
$("#filePhoto").change((event)=>{
    //var input=$(event.target)
    //console.log(input[0]) //<input id="filePhoto" type="file" name="filePhoto">
    //console.log(input)

    var input=$(event.target)[0]
    console.log(input) ////<input id="filePhoto" type="file" name="filePhoto">

    console.log(this.files) //undefined

    if(input.files && input.files[0]){
        var reader=new FileReader();
        reader.onload=()=>{
            console.log('loaded')
        }
        reader.readAsDataURL(input.files[0])
    }
}) */
$("#filePhoto").change(function(){

    if(this.files && this.files[0]){

        console.log(this.files,typeof this.files,this.files.length) //FileList containing all Files; arrayObj
        var reader=new FileReader();
        reader.onload=(e)=>{
            
            var image=document.getElementById("imagePreview")
            image.src=e.target.result
            //$('#imagePreview').attr("src",e.target.result) //ok
            console.log('imageFile loaded')
            if(cropper!==undefined) cropper.destroy()
            cropper=new Cropper(image,{
                aspectRatio:1/1, //square
                background:false //no grid bg
            })
        }
        reader.readAsDataURL(this.files[0])
    }
})
$('#imageUploadButton').click(()=>{
    var canvas=cropper.getCroppedCanvas(); //select the area chosen
    if(canvas==null) {
        alert('Could not upload image. Make sure it is an image file.');
        return
    }
//convert canvas to blob binary large obj; store image & video & transfer between 
    canvas.toBlob((blob)=>{ //done converting into blob then call cb (pass in the results blob)
        var formData=new FormData()
        formData.append('croppedImage',blob) //keyval
        console.log(formData)
        //fire ajax call
        $.ajax({
            url:"/api/users/profilePicture",
            type:"POST",
            data: formData,
            processData:false, //form Jquery NOT to convert formData to string
            contentType:false, //forms subbmitting files //need boundary/delimiter (separating data sent to server) in the request
            success: (data,status,xhr)=>location.reload()

        }) //need new POST url MW in apiRoutes users.js (inside having PUT/PATCH to mongoDB) 
        //POST imgFile to fs; PUT/PATCH img/profilePic to mongoDB
        //& also new non-api-routes (GET)

    })
    
})

$("#coverPhoto").change(function(){

    if(this.files && this.files[0]){

        console.log(this.files,typeof this.files,this.files.length) //FileList containing all Files; arrayObj
        var reader=new FileReader();
        reader.onload=(e)=>{
            
            var image=document.getElementById("coverPhotoPreview")
            image.src=e.target.result
            //$('#imagePreview').attr("src",e.target.result) //ok
            console.log('coverPhoto loaded')
            if(cropper!==undefined) cropper.destroy()
            cropper=new Cropper(image,{
                aspectRatio:16/9, //square
                background:false //no grid bg
            })
        }
        reader.readAsDataURL(this.files[0])
    }
})
$('#coverPhotoUploadButton').click(()=>{
    var canvas=cropper.getCroppedCanvas(); //select the area chosen
    if(canvas==null) {
        alert('Could not upload image. Make sure it is an image file.');
        return
    }
//convert canvas to blob binary large obj; store image & video & transfer between 
    canvas.toBlob((blob)=>{ //done converting into blob then call cb (pass in the results blob)
        var formData=new FormData()
        formData.append('croppedCoverPhoto',blob) //keyval
        console.log(formData)
        //fire ajax call
        $.ajax({
            url:"/api/users/coverPhoto",
            type:"POST",
            data: formData,
            processData:false, //form Jquery NOT to convert formData to string
            contentType:false, //forms subbmitting files //need boundary/delimiter (separating data sent to server) in the request
            success: (data,status,xhr)=>location.reload()

        }) 

    })
    
})



//pin button @modal just like delete btn: attach data-id & click handler to the button
$("#confirmPinModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget); 
    var postId=getPostIdFromElment(btn)
    $("#pinPostButton").data("id",postId) //add postId to the pin btn once modal open //data-id="${postData._id}"
    console.log($("#pinPostButton").data().id, typeof $("#pinPostButton").data().id)
})
$("#unpinModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget); 
    var postId=getPostIdFromElment(btn)
    $("#unpinPostButton").data("id",postId) //add postId to the pin btn once modal open //data-id="${postData._id}"
    console.log($("#unpinPostButton").data().id, typeof $("#unpinPostButton").data().id)
})
$("#pinPostButton").on('click',(event)=>{ 
    var Id=$(event.target).data('id') //data-id="${postData._id}" in createHTMLelement button
    console.log('pinPostId',Id,typeof Id)  //string
    $.ajax({
            url:`/api/posts/${Id}`,
            type:"PUT",
            data:{pinned:true},
            success:(pinnedPost,status,xhr)=>{ //status is status msg; statusCode is in xhr
                if(xhr.status!=204){alert("could not pin the post");return;}
                location.reload()

                /*
                pinnedClass="active"
                $('.pinnedButton').addClass('active')
                pinnedPostText="<i class='fas fa-thumbtack'></i> <span> Pinned post </span>"
                //$('.pinnedPostText').append(pinnedPostText)
                ////$('.pinnedPostText').text(pinnedPostText) //text would be html text; allpy to all
                dataTarget="#unpinModal"
                $(".pinnedButton.active").data("target","#unpinModal")
                *///and need to hide modal
               //above apply to all other posts on the web multiple pin & pinposttext; not specific to this post
                //unlike submitting a new normal post above - target at this new post
                //also unlike $('#chatNameButton').click in chatPageJs -> only one input box/bar for (changing) chatname
                }
        })
}) 
$("#unpinPostButton").on('click',(event)=>{ 
    var Id=$(event.target).data('id') //data-id="${postData._id}" in createHTMLelement button
    console.log('unpinPostId',Id,typeof Id)  //string
    $.ajax({
            url:`/api/posts/${Id}`,
            type:"PUT",
            data:{pinned:false},
            success:(pinnedPost,status,xhr)=>{ //status is status msg; statusCode is in xhr
                if(xhr.status!=204){alert("could not pin the post");return;}
                location.reload()

                /*
                $('.pinnedButton').removeClass('active')
                pinnedPostText="<i class='fas fa-thumbtack'></i> <span> Pinned post </span>"
                $('.pinnedPostText').html(pinnedPostText)
                //$('.pinnedPostText').append(pinnedPostText) //pin then unpin -> pinnedPostText twice for this post; add A pinnedposttext to all
                ////$('.pinnedPostText').text(pinnedPostText) //text would be html text; apply to all
                dataTarget="#confirmPinModal"
                $(".pinnedButton").data("target","#confirmPinModal")
                */ //and need to hide modal
               //above apply to all other posts on the web multiple pin & pinposttext; not specific to this post
                //unlike submitting a new normal post above - target at this new post
                //also unlike $('#chatNameButton').click in chatPageJs -> only one input box/bar for (changing) chatname
            }
        })
}) //pin another = unpin pinned + pin another
//retweetUser cannot delete or pin/unpin the retweet/retweetedPosts; retweetedUser when login can delete or unpin/pin retweet/retweetedPosts
//the rewteetUser can un-retweet (or unlike) the retweet/retweetedPosts
//repling to an existing post => is like posting a new normal/original post; can be liked/retweeted by anyone & pinned/deleted by someone who comments/replies
//retweet teh commentPost will lose 'replying to' text unless click the retweetPost or (retweeted)commentPost to read it on postPage
//because  post's retweetedPost (or called retweetData) (just ObjectId) is NOT populated (although postData in createHTML fn is retweetedPost)
//anyone can comment/like/retweet any of the Post that becomes retweetedPost





//for replacing newMessage.js; or create newMessageJs put the following in newMessage.Js
//var timer=1000; //so timer in search.js can be removed if commonJs b4 searchJs in main-layouts & var timer (must be) defined in here commonJs; 
//above var timer can be removed if searchJs if b4 commonJs +timer (must be) defined here in searchJs 
//or rename timer in commonJs or searchJs; 
//console.log("timer",timer)
//otherwise create newMessageJs & move following to newMessageJs
/*
$(searchBox).keydown((event)=>{
    clearTimeout();//reset previous timer
    var textbox=$(event.target)
    var value=textbox.val()
    var searchType=textbox.data().search //data-search in searchPage.pug//selectedTab from searchRoutes
    console.log('searchbox:',value,searchType)
    timer=setTimeout(() => {
        value=textbox.val().trim();
        if(value=='') $(".resultsContainer").html('')
        else{console.log(value);search(value,searchType)}
    }, 1000);
})
function search(searchTerm,searchType){
    var url=searchType=="users"?"/api/users":"/api/posts"  
    $.get(url,{search:searchTerm},(searchRes)=>{ //req.query.search in api routes // '/?&'
        console.log('search results ',searchRes) //populated (as defined in getPosts in posts.js) searchRes
        if(searchType=='users') outputUsers(searchRes,$(".resultsContainer"))
        else outputPosts(searchRes,$('.resultsContainer'))
    })
}*/


function getPostIdFromElment(element){
    var isRoot=element.hasClass('post')
    var rootElment= isRoot===true? element: element.closest(".post");
    var postId=rootElment.data().id; //keyval data() contains id 
    console.log(postId,typeof postId) //string
    if(postId===undefined)return alert('Post id undefined')
    return postId
}

function createPostHtml(postData,largeFont=false){
    if(postData==null) return alert("post object is null")

//    return postData.content //but if retweet
    var isRetweet=postData.retweetData!=undefined;
    var retweetedBy=isRetweet?postData.postedBy.username:null
    postData=isRetweet?postData.retweetData:postData //retweetData is parentData/Post so class 'post''s id -> parentId you're replying to
    //otherwise its new normal post or new commentPost - new timediff

    var displayName=postData.postedBy.fName+' '+postData.postedBy.lName
    var timestamp=timeDifference(new Date(),new Date(postData.postedBy.createdAt)) //postData.postedBy.createdAt
    var likeBtnActiveClass=postData.likes.includes(userLoggedInJs._id)?"active":""
    var retweetBtnActiveClass=postData.retweetUsers.includes(userLoggedInJs._id)?"active":""

    //retweetText is childText
    var retweetText=isRetweet?
    `<span> Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a></span>`:''

    if(postData._id=='6071d280d69e9012686a84b9'){console.log("why")}
    var replyFlag=""
    //postData.commentedPost is Not null or undefined even if postData.commentedPost is not populated as postData.commentedPost is mongoObjId
    //but postData.commentedPost._id is undefined (also postData.commentedPost.postedBy) if postData.commentedPost not populated 
    //[UNLIKE BACKEND WHERE UNPOPULATED OBJ STILL HAS ._id (obj) (&.id (string)) fields] SEE SOCKET IO newMsg in messagesJs chatPageJs appJs
    // if(postData.commentedPost){alert(postData.commentedPost);alert(typeof postData.commentedPost)}
//  if(postData.commentedPost){  //firstly making sure there's replyTo/commentedPost field - this is the new post that responde to other post (commentedPost); 
        //not normal newpost that .commentedPost is undefined
    //console.log(postData.commentedPost._id) //undefined -> to tell if .commentedPost being populated
    //    if(postData.commentedPost.postedBy) //true if .commentedPost populated//postedData in '/'POST in posts.js includes postedBy:req.session.user; so .postedBy not undefined
    // uncaught type error  - in case we did sth wrong; checking what we done if we missed any - complier error (null.xx)
    //    console.log("commentedPostBy",postData.commentedPost.postedBy)
    if(postData.commentedPost && postData.commentedPost._id){ //firstlyB as we dont have chain populate - only populate commentedPost once but below return alert will stop the process 
        if(!postData.commentedPost._id){ //secondly checking if .commentedPost is populated 
            //or !postData.commentedPost.postedBy as if commentedPost populated then .postedBy is defined
            return alert("replyTo/commentedPost is not populated")
        } //but firstly-> firstlyB makes secondly unnecessary
        //after secondly (or new firstlyB) now postData.commentedPost is populated below; postData.commentedPost._id or .postedBy is def not undefined as this field's not empty when new post
        if(postData.commentedPost.postedBy){ //this checking can be skipped //exists here just for completeness - not important; this 'if' can be deleted
            if(!postData.commentedPost.postedBy._id){ //then checking if postedBy is populated //or !postData.commentedPost.postedBy.username
                //if  .postedBy populated -> def having ._id & .username as they are required fields
                return alert("postedBy field is not populated")
            }
            var replyToUsername=postData.commentedPost.postedBy.username
            replyFlag=`<div class='replyFlag'> Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername} </a> </div>`
        }
    }

    var largeFontClass= largeFont?"largeFont":""

    var buttons="";
    var pinnedPostText="" //shown pinned post for whoever this post originally posted by; NOT shown to other users when they login
    //show pinned (if post is retweeted) still only to retweeted User not retweetUser
    if(postData.postedBy._id===userLoggedInJs._id){ //from req.session.user middleMW; req.session.user has ._id field (like db?)
        //pass userLoggedIn & userloggedInJs to main-layouts but only continue pass userLoggedInJs to frontend javascript
        /*
        buttons=`<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal">
                    <i class="fas fa-times"></i>
                </button>`
        */ //ok but now need to add pin button too see below updated btn

        var dataTarget="#confirmPinModal"
        var pinnedClass=""
        //var pinnedPostText="" //shown as undefined on the website if diff user logged in; so lifted to global scope
        if(postData.pinned===true){
            pinnedClass="active"
            pinnedPostText="<i class='fas fa-thumbtack'></i> <span> Pinned post </span>"
            dataTarget="#unpinModal"
        }
        

        //data-target="#confirmPinModal"; but now need to unpin if pinned; "#unpinModal" //linked to Modal@mixin.pug
        buttons=`<button class='pinnedButton ${pinnedClass}' data-id="${postData._id}" data-toggle="modal" data-target=${dataTarget}>
                    <i class="fas fa-thumbtack"></i>
                </button>
                <button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal">
                    <i class="fas fa-times"></i>
                </button>`

    } //data-id="${postData.postedBy._id}" or data-id=${postData.postedBy._id} both fine

    //comment & retweet & like & clickopen single post page NOT on the retweetPost actuall on retweetedPost
    //like: patch/put on the original post; retweet: post new post but createhtmlelement with updated original retweetedPost; comment: post a new htmlelement(post) with new _id

/*    console.log("postData.id",postData.id,typeof postData.id,"postData._id",postData._id,typeof postData._id) //undefined undefined//string
    console.log("postData.postedBy.id",postData.postedBy.id,typeof postData.postedBy.id) //undefined undefined
    console.log("postData.postedBy._id",postData.postedBy._id,typeof postData.postedBy._id) //string
    console.log("userLoggedInJs.id",userLoggedInJs.id,typeof userLoggedInJs.id) //undefined undefined
    console.log("userLoggedInJs._id",userLoggedInJs._id,typeof userLoggedInJs._id) //string
*/
    //do we need backtick in return?
    //quotes <img src='${postData.postedBy.profilePic}'> or <img src=${postData.postedBy.profilePic}> both ok inside backtick
    return `<div class='post ${largeFontClass}' data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postData.postedBy.profilePic}'>
                    </div>

                    <div class='postContentContainer'>

                        <div class='pinnedPostText'>${pinnedPostText}</div>

                        <div class='postHeader'>
                            <a href='/profile/${postData.postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postData.postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postBtnContainer'>
                                <button type="button" data-toggle='modal' data-target='#replyModal'>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postBtnContainer green'>
                                <button class='retweetButton ${retweetBtnActiveClass}'>
                                    <i class='fas fa-retweet'></i>
                                    <span>${postData.retweetUsers.length || ''}</span>
                                </button>
                            </div>
                            <div class='postBtnContainer red'>
                                <button class='likeButton ${likeBtnActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ''}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}



function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000<30) return "Just now"
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}



function outputPosts(getData,container){
    container.html("")

    if(!Array.isArray(getData)){
        getData=[getData]
    } //single post for modal

    getData.forEach(post=>{
        var html=createPostHtml(post)//from fn from common.js
        container.append(html)
    })

    if(getData.length==0){container.append("<span class='noResults'> Nothing to show </span>")}
}


//below click single post redirect to postPage; below fn used in postPage show repliedTo posts & comments on loaidng
function outputPostsWithReplies(getData,container){
    container.html("")

//    if(!Array.isArray(getData)){getData=[getData]} //no need although getData is a single post obj (not an array)
    if(getData.commentedPost!==undefined && getData.commentedPost._id!==undefined){ 
        //making sure .commentedPost is defined & populated (so not just onl having ObjId)
        var html=createPostHtml(getData.commentedPost)//from fn from common.js
        container.append(html)
    }
    var mainPostHtml=createPostHtml(getData.thisPostData,true)//createPostHtml from fn from common.js//getData is returned thisPost from api/posts.js
        container.append(mainPostHtml) //always having main post which user clicks on

        console.log("getData.comments ",getData.comments)
    getData.comments.forEach(post=>{
        var html=createPostHtml(post)//from fn from common.js
        container.append(html)
    })

//    if(getData.length==0){container.append("<span class='noResults'> Nothing to show </span>")}
}