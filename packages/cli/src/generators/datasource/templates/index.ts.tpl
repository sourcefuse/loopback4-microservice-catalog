<% for(let i=0; i< nameArr.length; i++) {-%>
export * from './<%= nameArr[i].fileName -%>.datasource';
<% } -%>