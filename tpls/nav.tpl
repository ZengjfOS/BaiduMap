<h2> Menu </h2>
<hr />
<% _.each(obj, function(e, i) { %>
    <button type="button" class="btn btn-default w-100 mt-2" id="<%= i %>_click"> <%= e %> </button>
<% }) %>
<hr />
