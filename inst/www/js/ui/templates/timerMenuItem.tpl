<li class="js-rcap-dynamic" data-timerid="<%=t.id%>"> 
    <a href="javascript:void(0)">
        <i class="icon-time"></i>
        <%if(t.variable && t.interval) {%>
            <%if(t.variable) {%>
                <br />
                Variable: <%=t.variable%>          
            <%}%>
            <br />
            Every: <%=t.interval%> seconds
        <%} else {%>
            This timer is not configured
        <%}%>
        <span class="timer-settings settings" title="Configure timer">Settings</span> 
    </a>
</li>