<h2> <%= title %> </h2>
<hr />
<div class="row clearfix">
  <div class="col-md-12 column">
    <table class="table">
      <thead>
        <tr>
          <% _.each(index, function(i) { %>
            <th>
              <%= i %>
            </th>
          <% }) %>
        </tr>
      </thead>
      <tbody>
        <% _.each(table, function(e, i) { %>
        <tr class="success">
          <td>
            <%= i %>
          </td>
          <td>
            <%= e.name %>
          </td>
          <td>
            <select class="<%= name %><%= e.name %>_selectpicker">
              <% _.each(e.value, function(v) { %>
                  <option><%= v %></option>
              <% }) %>
            </select>
          </td>
          <td>
            <%= e.info %>
          </td>
        </tr>
        <% }) %>
      </tbody>
    </table>
    <button type="button" class="btn btn-default w-100 mt-2 subscribeButton" id="<%= name %>_<%= button %>_click"> <%= button %> </button>
  </div>
</div>
